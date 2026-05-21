const express = require('express');
const router = express.Router();
const { validateCoupon, createCoupon, getActiveCoupons } = require('../controllers/couponController');
const { protect, authorize } = require('../middleware/auth');

router.get('/active', getActiveCoupons);
router.post('/validate', protect, validateCoupon);
router.post('/create', protect, authorize('admin', 'owner'), createCoupon);

module.exports = router;
