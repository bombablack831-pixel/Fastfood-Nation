const Restaurant = require('../models/Restaurant');
const Food = require('../models/Food');
const Review = require('../models/Review');
const User = require('../models/User');
const Order = require('../models/Order');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

const getTopRatedRestaurants = catchAsync(async (req, res, next) => {
    const restaurants = await Restaurant.find()
        .sort({ rating: -1, numReviews: -1 })
        .limit(10);
    
    res.json({
        status: 'success',
        results: restaurants.length,
        restaurants
    });
});

const getNearbyRestaurants = catchAsync(async (req, res, next) => {
    const { lng, lat, distance = 5 } = req.query; // distance in km

    if (!lng || !lat) {
        return next(new AppError('Please provide longitude and latitude', 400));
    }

    const restaurants = await Restaurant.find({
        location: {
            $near: {
                $geometry: {
                    type: 'Point',
                    coordinates: [parseFloat(lng), parseFloat(lat)]
                },
                $maxDistance: distance * 1000 // Convert km to meters
            }
        }
    });

    res.json({
        status: 'success',
        results: restaurants.length,
        restaurants
    });
});

const searchAndFilterFoods = catchAsync(async (req, res, next) => {
    const { keyword, category, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
    
    // 1. Build Query Object
    const query = { isAvailable: true };

    // Search by Name
    if (keyword) {
        query.name = { $regex: keyword, $options: 'i' };
    }

    // Filter by Category
    if (category) {
        query.category = category;
    }

    // Filter by Price Range
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = Number(minPrice);
        if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // 2. Execution with Pagination
    const skip = (page - 1) * limit;
    
    // Run count and query in parallel for performance
    const [foods, totalCount] = await Promise.all([
        Food.find(query)
            .populate('restaurant', 'name image rating')
            .skip(skip)
            .limit(Number(limit))
            .sort('-createdAt'),
        Food.countDocuments(query)
    ]);

    res.json({
        status: 'success',
        results: foods.length,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
        currentPage: Number(page),
        foods
    });
});

const createRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.create({ ...req.body, owner: req.user._id });
  res.status(201).json(restaurant);
});

const getRestaurants = catchAsync(async (req, res, next) => {
  const restaurants = await Restaurant.find().populate('owner', 'name');
  res.json(restaurants);
});

const getOwnerRestaurant = catchAsync(async (req, res, next) => {
  const restaurant = await Restaurant.findOne({ owner: req.user._id });
  if (!restaurant) return next(new AppError('Restaurant not found', 404));
  res.json(restaurant);
});

const addFoodItem = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.params;
  const food = await Food.create({ ...req.body, restaurant: restaurantId });
  res.status(201).json(food);
});

const updateFoodItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const food = await Food.findByIdAndUpdate(id, req.body, { new: true });
  if (!food) return next(new AppError('Food item not found', 404));
  res.json(food);
});

const deleteFoodItem = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const food = await Food.findByIdAndDelete(id);
  if (!food) return next(new AppError('Food item not found', 404));
  res.json({ status: 'success', message: 'Food item deleted successfully' });
});

const getRestaurantMenu = catchAsync(async (req, res, next) => {
  const { restaurantId } = req.params;
  const menu = await Food.find({ restaurant: restaurantId });
  res.json(menu);
});

const getRestaurantById = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) return next(new AppError('Restaurant not found', 404));
    res.json(restaurant);
});

const getReviews = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const reviews = await Review.find({ restaurant: id }).populate('user', 'name');
    res.json(reviews);
});

const addReview = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { rating, comment } = req.body;
    
    // Check if user has already reviewed - (Model level unique index will also catch this)
    const existingReview = await Review.findOne({ restaurant: id, user: req.user._id });
    if (existingReview) {
        return next(new AppError('You have already reviewed this restaurant', 400));
    }
    
    const review = await Review.create({
        user: req.user._id,
        restaurant: id,
        rating: Number(rating),
        comment
    });
    
    // Note: Average rating is calculated automatically via Review model hooks
    
    res.status(201).json({
        status: 'success',
        review
    });
});

const toggleOpenStatus = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return next(new AppError('Restaurant not found', 404));
    
    restaurant.isOpened = !restaurant.isOpened;
    await restaurant.save();
    res.json(restaurant);
});

const updateRestaurant = catchAsync(async (req, res, next) => {
    const { name, description, address, cuisine, image, location } = req.body;
    
    // Find restaurant first to ensure it exists
    let restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) {
        return next(new AppError('Restaurant not found', 404));
    }

    // Build update object
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (address !== undefined) updateData.address = address;
    if (cuisine !== undefined) updateData.cuisine = cuisine;
    if (image !== undefined) updateData.image = image;
    
    if (location && location.coordinates) {
        updateData.location = {
            type: 'Point',
            coordinates: [
                parseFloat(location.coordinates[0]) || 0,
                parseFloat(location.coordinates[1]) || 0
            ]
        };
    }

    console.log('[DEBUG] Update Restaurant Data:', updateData);

    const updatedRestaurant = await Restaurant.findOneAndUpdate(
        { owner: req.user._id },
        { $set: updateData },
        { new: true, runValidators: true }
    );

    console.log('[DEBUG] Updated Restaurant Result:', updatedRestaurant);

    res.json(updatedRestaurant);
});

const getRiders = catchAsync(async (req, res, next) => {
    const riders = await User.find({ 
        role: { $in: ['delivery', 'deliveryBoy'] } 
    });
    res.json(riders);
});

const getRestaurantAnalytics = catchAsync(async (req, res, next) => {
    const restaurant = await Restaurant.findOne({ owner: req.user._id });
    if (!restaurant) return next(new AppError('Restaurant not found', 404));

    const orders = await Order.find({ restaurant: restaurant._id }).populate('items.food');
    
    // 1. Weekly Orders Volume
    const last7Days = [...Array(7)].map((_, i) => {
        const d = new Date();
        d.setDate(d.getDate() - i);
        return d.toISOString().split('T')[0];
    }).reverse();

    const weeklyOrders = last7Days.map(day => {
        const count = orders.filter(o => o.createdAt.toISOString().split('T')[0] === day).length;
        return { day: new Date(day).toLocaleDateString('en-US', { weekday: 'short' }), orders: count };
    });

    // 2. Top Selling Items
    const itemMap = {};
    orders.forEach(order => {
        order.items.forEach(item => {
            if (item.food) {
                const name = item.food.name;
                itemMap[name] = (itemMap[name] || 0) + item.quantity;
            }
        });
    });

    const topItems = Object.entries(itemMap)
        .map(([name, count]) => ({ name, orders: count }))
        .sort((a, b) => b.orders - a.orders)
        .slice(0, 5);

    // Calculate percentages for UI bars
    const maxOrders = topItems[0]?.orders || 1;
    topItems.forEach(item => {
        item.pct = Math.round((item.orders / maxOrders) * 100);
        item.revenue = `₹${(item.orders * 250).toLocaleString()}`; // Estimated revenue fallback
    });

    // 3. KPI Stats
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const totalRevenue = deliveredOrders.reduce((sum, o) => sum + o.totalAmount, 0);
    const avgRating = restaurant.rating || 0;
    const totalOrders = orders.length;

    res.json({
        weeklyOrders,
        topItems,
        stats: {
            totalOrders,
            totalRevenue,
            avgRating,
            deliveredCount: deliveredOrders.length
        }
    });
});

const getTrendingItems = catchAsync(async (req, res, next) => {
    // Return high-rated food items that HAVE a valid restaurant
    const foods = await Food.find()
        .sort('-createdAt')
        .limit(20)
        .populate('restaurant', 'name address');
    
    // Filter out items where restaurant is missing or deleted
    const validFoods = foods.filter(f => f.restaurant).slice(0, 10);
    
    res.json(validFoods);
});

module.exports = { 
  createRestaurant, 
  getRestaurants, 
  getOwnerRestaurant, 
  getRiders,
  getRestaurantAnalytics,
  addFoodItem, 
  updateFoodItem, 
  deleteFoodItem, 
  getRestaurantMenu,
  getTrendingItems,
  getRestaurantById,
  getReviews,
  addReview,
  toggleOpenStatus,
  updateRestaurant,
  searchAndFilterFoods,
  getNearbyRestaurants,
  getTopRatedRestaurants
};
