const mongoose = require('mongoose');
const User = require('../models/User');

async function checkRiders() {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/food-delivery');
        const riders = await User.find({ role: { $in: ['delivery', 'deliveryBoy'] } });
        console.log('--- RIDERS FOUND ---');
        for (const r of riders) {
            r.status = 'available';
            await r.save();
            console.log(`ID: ${r._id} | Name: ${r.name} | Role: ${r.role} | Status: ${r.status}`);
        }
        console.log('Total:', riders.length);
        
        if (riders.length === 0) {
            console.log('No riders found. Creating a test rider...');
            const testRider = await User.create({
                name: 'Test Rider',
                email: 'rider@test.com',
                password: 'password123',
                role: 'deliveryBoy',
                status: 'available',
                phone: '1234567890'
            });
            console.log('Created test rider:', testRider.name);
        }
        
    } catch (err) {
        console.error(err);
    } finally {
        await mongoose.disconnect();
    }
}

checkRiders();
