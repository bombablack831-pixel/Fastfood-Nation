const User = require('../models/User');
const Restaurant = require('../models/Restaurant');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');

// ─── DASHBOARD STATS ────────────────────────────────────────────────────────

// @desc    Get Admin Stats
// @route   GET /api/admin/stats
const getStats = async (req, res) => {
    try {
        const [totalUsers, totalRestaurants, totalOrders, totalCoupons] = await Promise.all([
            User.countDocuments(),
            Restaurant.countDocuments(),
            Order.countDocuments(),
            Coupon.countDocuments(),
        ]);

        const orders = await Order.find({}, 'totalAmount status createdAt');
        const totalRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0);
        const pendingOrders = orders.filter(o => ['placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery'].includes(o.status)).length;
        const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
        const cancelledOrders = orders.filter(o => o.status === 'cancelled').length;

        // Monthly revenue for chart (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
        sixMonthsAgo.setDate(1);
        sixMonthsAgo.setHours(0, 0, 0, 0);

        const monthlyRevenue = await Order.aggregate([
            { $match: { createdAt: { $gte: sixMonthsAgo }, status: 'delivered' } },
            {
                $group: {
                    _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Recent 10 orders
        const recentOrders = await Order.find()
            .sort('-createdAt')
            .limit(10)
            .populate('customer', 'name email')
            .populate('restaurant', 'name image');

        // Top restaurants by order count
        const topRestaurants = await Order.aggregate([
            { $group: { _id: '$restaurant', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
            { $sort: { count: -1 } },
            { $limit: 5 },
            { $lookup: { from: 'restaurants', localField: '_id', foreignField: '_id', as: 'restaurant' } },
            { $unwind: '$restaurant' },
            { $project: { name: '$restaurant.name', image: '$restaurant.image', count: 1, revenue: 1 } }
        ]);

        res.json({
            totalUsers, totalRestaurants, totalOrders, totalRevenue,
            pendingOrders, deliveredOrders, cancelledOrders, totalCoupons,
            monthlyRevenue, recentOrders, topRestaurants
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── USERS ───────────────────────────────────────────────────────────────────

// @route GET /api/admin/users
const getUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password').sort('-createdAt');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/admin/users/:id/role
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body;
        const allowedRoles = ['customer', 'restaurantOwner', 'deliveryBoy', 'admin'];
        if (!allowedRoles.includes(role)) return res.status(400).json({ message: 'Invalid role' });
        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── RESTAURANTS ─────────────────────────────────────────────────────────────

// @route GET /api/admin/restaurants
const getRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find().populate('owner', 'name email').sort('-createdAt');
        res.json(restaurants);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/admin/restaurants/:id/toggle
const toggleRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        restaurant.isOpened = !restaurant.isOpened;
        await restaurant.save();
        res.json(restaurant);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE /api/admin/restaurants/:id
const deleteRestaurant = async (req, res) => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
        if (!restaurant) return res.status(404).json({ message: 'Restaurant not found' });
        res.json({ message: 'Restaurant deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── ORDERS ──────────────────────────────────────────────────────────────────

// @route GET /api/admin/orders
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customer', 'name email')
            .populate('restaurant', 'name image')
            .populate('deliveryBoy', 'name')
            .sort('-createdAt');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/admin/orders/:id/status
const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const validStatuses = ['placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) return res.status(400).json({ message: 'Invalid status' });
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true })
            .populate('customer', 'name email')
            .populate('restaurant', 'name');
        if (!order) return res.status(404).json({ message: 'Order not found' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// ─── COUPONS ─────────────────────────────────────────────────────────────────

// @route GET /api/admin/coupons
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort('-createdAt');
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route POST /api/admin/coupons
const createCoupon = async (req, res) => {
    try {
        const { code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate } = req.body;
        const exists = await Coupon.findOne({ code: code.toUpperCase() });
        if (exists) return res.status(400).json({ message: 'Coupon code already exists' });
        const coupon = await Coupon.create({ code, discountType, discountValue, minOrderAmount, maxDiscount, expiryDate });
        res.status(201).json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PUT /api/admin/coupons/:id
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route DELETE /api/admin/coupons/:id
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @route PATCH /api/admin/coupons/:id/toggle
const toggleCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
        coupon.isActive = !coupon.isActive;
        await coupon.save();
        res.json(coupon);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getStats,
    getUsers, updateUserRole, deleteUser,
    getRestaurants, toggleRestaurant, deleteRestaurant,
    getAllOrders, updateOrderStatus,
    getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon,
};
