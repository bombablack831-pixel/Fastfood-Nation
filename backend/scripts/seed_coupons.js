require('dotenv').config();
const mongoose = require('mongoose');
const Coupon = require('./models/Coupon');

const coupons = [
    {
        code: 'WELCOME50',
        discountType: 'percent',
        discountValue: 50,
        maxDiscount: 150,
        minOrderAmount: 200,
        expiryDate: new Date('2026-12-31'),
        isActive: true
    },
    {
        code: 'SAVE100',
        discountType: 'flat',
        discountValue: 100,
        minOrderAmount: 500,
        expiryDate: new Date('2026-12-31'),
        isActive: true
    },
    {
        code: 'FREEDEL',
        discountType: 'flat',
        discountValue: 40, // Assuming delivery charge is 40
        minOrderAmount: 300,
        expiryDate: new Date('2026-12-31'),
        isActive: true
    }
];

const seedCoupons = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        await Coupon.deleteMany({});
        console.log('Cleared existing coupons');

        await Coupon.insertMany(coupons);
        console.log('Successfully seeded coupons');

        process.exit();
    } catch (error) {
        console.error('Seeding failed:', error);
        process.exit(1);
    }
};

seedCoupons();
