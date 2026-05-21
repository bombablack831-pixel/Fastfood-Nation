const express = require('express');
const router = express.Router();
const {
    getStats,
    getUsers, updateUserRole, deleteUser,
    getRestaurants, toggleRestaurant, deleteRestaurant,
    getAllOrders, updateOrderStatus,
    getCoupons, createCoupon, updateCoupon, deleteCoupon, toggleCoupon,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

// Dashboard
router.get('/stats', getStats);

// Users
router.get('/users', getUsers);
router.patch('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Restaurants
router.get('/restaurants', getRestaurants);
router.patch('/restaurants/:id/toggle', toggleRestaurant);
router.delete('/restaurants/:id', deleteRestaurant);

// Orders
router.get('/orders', getAllOrders);
router.patch('/orders/:id/status', updateOrderStatus);

// Coupons
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.patch('/coupons/:id/toggle', toggleCoupon);

module.exports = router;
