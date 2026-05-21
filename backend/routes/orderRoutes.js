const express = require('express');
const router = express.Router();
const { 
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
} = require('../controllers/orderController');
const { placeOrderSchema, updateStatusSchema } = require('../validations/orderValidation');
const validate = require('../middleware/validate');
const { protect, authorize } = require('../middleware/auth');

router.post('/place', protect, validate(placeOrderSchema), placeOrder);
router.post('/verify-payment', protect, verifyPayment);
router.post('/webhook', handleWebhook);
router.get('/my-orders', protect, getMyOrders);
router.get('/last', protect, getLastOrder);
router.get('/restaurant/:restaurantId', protect, authorize('owner'), getRestaurantOrders);
router.get('/delivery/active', protect, authorize('delivery'), getDeliveryOrders);
router.get('/delivery/available', protect, authorize('delivery'), getAvailableOrders);
router.get('/:id', protect, getOrderById);
router.put('/:orderId/status', protect, authorize('owner', 'delivery', 'admin'), validate(updateStatusSchema), updateOrderStatus);

module.exports = router;
