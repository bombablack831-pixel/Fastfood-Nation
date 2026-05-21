const Coupon = require('../models/Coupon');

const validateCoupon = async (req, res) => {
    const { code, amount } = req.body;

    try {
        const coupon = await Coupon.findOne({ code: code.toUpperCase(), isActive: true });

        if (!coupon) {
            return res.status(404).json({ message: 'Invalid or expired coupon code' });
        }

        if (new Date() > coupon.expiryDate) {
            return res.status(400).json({ message: 'This coupon has expired' });
        }

        if (amount < coupon.minOrderAmount) {
            return res.status(400).json({ message: `Minimum order amount for this coupon is ₹${coupon.minOrderAmount}` });
        }

        let discount = 0;
        if (coupon.discountType === 'flat') {
            discount = coupon.discountValue;
        } else {
            discount = (amount * coupon.discountValue) / 100;
            if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                discount = coupon.maxDiscount;
            }
        }

        res.json({
            code: coupon.code,
            discount,
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const createCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.create(req.body);
        res.status(201).json(coupon);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const getActiveCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({ 
            isActive: true, 
            expiryDate: { $gt: new Date() } 
        }).limit(5);
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { validateCoupon, createCoupon, getActiveCoupons };
