const mongoose = require('mongoose');
require('dotenv').config();
const Food = require('../models/Food');

async function checkFoods() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const foods = await Food.find().populate('restaurant');
        console.log(`Total Foods: ${foods.length}`);
        
        const invalidFoods = foods.filter(f => !f.restaurant);
        console.log(`Foods without Restaurant: ${invalidFoods.length}`);
        
        if (invalidFoods.length > 0) {
            console.log('Sample invalid foods:', invalidFoods.slice(0, 3).map(f => ({ id: f._id, name: f.name })));
        }
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkFoods();
