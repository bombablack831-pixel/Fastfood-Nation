const mongoose = require('mongoose');
require('dotenv').config({ path: './.env' });

async function checkData() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        const Restaurant = mongoose.model('Restaurant', new mongoose.Schema({}, { strict: false }));
        const restaurants = await Restaurant.find({});
        
        console.log(`📊 Total Restaurants found: ${restaurants.length}`);
        
        if (restaurants.length > 0) {
            console.log('--- Sample Restaurant ---');
            console.log(JSON.stringify(restaurants[0], null, 2));
        } else {
            console.log('❌ No restaurants found in database!');
        }

        process.exit(0);
    } catch (err) {
        console.error('❌ Error:', err.message);
        process.exit(1);
    }
}

checkData();
