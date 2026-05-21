const orderService = require('../services/orderService');
const orderRepository = require('../repositories/orderRepository');
const catchAsync = require('../utils/catchAsync');

/**
 * Order Controller
 * Thin layer focused on handling HTTP requests and responses.
 */
const placeOrder = catchAsync(async (req, res, next) => {
    const io = req.app.get('io');
    const result = await orderService.placeNewOrder(req.user, req.body, io);
    res.status(201).json(result);
});

const verifyPayment = catchAsync(async (req, res, next) => {
    const io = req.app.get('io');
    const order = await orderService.verifyOrderPayment(req.body, io);
    res.json({ success: true, order });
});

const updateOrderStatus = catchAsync(async (req, res, next) => {
    const io = req.app.get('io');
    const order = await orderService.updateStatus(req.params.orderId, req.body, io);
    res.json(order);
});

const getMyOrders = catchAsync(async (req, res, next) => {
    const orders = await orderRepository.findByUserId(req.user._id);
    res.json(orders);
});

const getLastOrder = catchAsync(async (req, res, next) => {
    const order = await orderRepository.findLatestByUserId(req.user._id);
    res.json(order);
});

const getRestaurantOrders = catchAsync(async (req, res, next) => {
    const orders = await orderRepository.findByRestaurantId(req.params.restaurantId);
    res.json(orders);
});

const getDeliveryOrders = catchAsync(async (req, res, next) => {
    const orders = await orderRepository.findActiveByDeliveryBoy(req.user._id);
    res.json(orders);
});

const getAvailableOrders = catchAsync(async (req, res, next) => {
    const { lat, lng } = req.query;
    const orders = await orderRepository.findAvailableForPickUp({ lat, lng });
    res.json(orders);
});

const getOrderById = catchAsync(async (req, res, next) => {
    const order = await orderRepository.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
});

const handleWebhook = catchAsync(async (req, res, next) => {
    // Webhook logic often stays more monolithic or calls a specialized service
    // For simplicity, we could also move this to orderService.processWebhook
    const status = await orderService.processWebhook(req.body, req.headers['x-razorpay-signature']);
    res.json({ status });
});

module.exports = { 
  placeOrder, 
  verifyPayment,
  handleWebhook,
  getMyOrders, 
  updateOrderStatus, 
  getLastOrder, 
  getRestaurantOrders, 
  getDeliveryOrders, 
  getAvailableOrders,
  getOrderById
};
