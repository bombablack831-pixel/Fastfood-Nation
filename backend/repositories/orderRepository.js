const Order = require('../models/Order');

/**
 * Order Repository
 * Handles all direct database operations for Orders.
 */
class OrderRepository {
  async create(orderData) {
    return await Order.create(orderData);
  }

  async findById(id) {
    return await Order.findById(id)
      .populate('customer', 'name email phone')
      .populate('restaurant', 'name address phone image location')
      .populate('items.food', 'name price image');
  }

  async findByUserId(userId) {
    return await Order.find({ customer: userId })
      .sort('-createdAt');
  }

  async findByRestaurantId(restaurantId) {
    return await Order.find({ restaurant: restaurantId })
      .populate('customer', 'name phone')
      .populate('items.food', 'name')
      .sort('-createdAt');
  }

  async findActiveByDeliveryBoy(deliveryBoyId) {
    return await Order.find({ deliveryBoy: deliveryBoyId })
      .populate('restaurant', 'name address image location')
      .populate('customer', 'name phone')
      .sort('-createdAt');
  }

  async findAvailableForPickUp(coords) {
    const query = { 
      status: { $in: ['preparing', 'confirmed'] },
      deliveryBoy: { $exists: false }
    };

    if (coords && coords.lat && coords.lng) {
      // Find restaurants near the rider first
      const Restaurant = require('../models/Restaurant');
      const nearbyRestaurants = await Restaurant.find({
        location: {
          $near: {
            $geometry: { type: 'Point', coordinates: [parseFloat(coords.lng), parseFloat(coords.lat)] },
            $maxDistance: 10000 // 10km radius
          }
        }
      }).select('_id');
      
      const restaurantIds = nearbyRestaurants.map(r => r._id);
      query.restaurant = { $in: restaurantIds };
    }

    return await Order.find(query).populate('restaurant', 'name address location');
  }

  async findLatestByUserId(userId) {
    return await Order.findOne({ customer: userId })
      .sort({ createdAt: -1 })
      .populate('restaurant', 'name image')
      .populate('items.food', 'name image');
  }

  async findByRazorpayId(razorpayOrderId) {
    return await Order.findOne({ razorpayOrderId });
  }

  async update(id, updateData) {
    return await Order.findByIdAndUpdate(id, updateData, { new: true });
  }
}

module.exports = new OrderRepository();
