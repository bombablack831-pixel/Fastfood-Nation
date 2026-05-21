const mongoose = require('mongoose');
require('dotenv').config();
const User = require('../models/User');
const Restaurant = require('../models/Restaurant');

async function fixOwner() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const owner = await User.findOne({ email: 'owner@example.com' });
        
        if (!owner) {
            console.log('Owner user not found');
            process.exit(1);
        }

        const restaurant = await Restaurant.findOne({ owner: owner._id });
        if (!restaurant) {
            console.log('Creating restaurant for owner...');
            await Restaurant.create({
                name: 'SpiceHub Premium',
                owner: owner._id,
                description: 'The finest culinary experience in the city.',
                address: '123 Gourmet Street, Palanpur',
                image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=2070&auto=format&fit=crop',
                cuisine: ['Indian', 'Chinese', 'Continental'],
                location: {
                    type: 'Point',
                    coordinates: [72.336, 24.103]
                }
            });
            console.log('Restaurant created successfully!');
        } else {
            console.log('Restaurant already exists for this owner.');
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

fixOwner();
