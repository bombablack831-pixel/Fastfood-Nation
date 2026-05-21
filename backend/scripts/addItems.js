const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Food = require('./models/Food');
const Restaurant = require('./models/Restaurant');
const User = require('./models/User');

dotenv.config();

const addPremiumItems = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to DB...');

        const owner = await User.findOne({ email: 'owner@example.com' });
        if (!owner) {
            console.log('Owner not found');
            process.exit(1);
        }

        const restaurant = await Restaurant.findOne({ owner: owner._id });
        if (!restaurant) {
            console.log('Restaurant not found for this owner');
            process.exit(1);
        }

        const premiumFoods = [
            {
                name: 'Truffle Magic Pizza',
                description: 'Exotic mushrooms, white truffle oil, and creamy burrata cheese on a charcoal crust.',
                price: 849,
                image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=1000',
                category: 'Signature',
                restaurant: restaurant._id
            },
            {
                name: 'Gold Leaf Burger',
                description: 'Aged Wagyu beef, edible 24k gold leaf, caramelized onions, and black garlic aioli.',
                price: 1299,
                image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000',
                category: 'Gourmet',
                restaurant: restaurant._id
            },
            {
                name: 'Saffron Seafood Paella',
                description: 'Spanish saffron infused rice with grilled lobster tail, prawns, and mussels.',
                price: 1599,
                image: 'https://images.unsplash.com/photo-1534080564583-6be75777b70a?q=80&w=1000',
                category: 'Signature',
                restaurant: restaurant._id
            },
            {
                name: 'Belgian Chocolate Lava',
                description: 'Molten center dark chocolate cake served with Madagascar vanilla bean gelato.',
                price: 499,
                image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=1000',
                category: 'Dessert',
                restaurant: restaurant._id
            }
        ];

        await Food.insertMany(premiumFoods);
        console.log(`Successfully added ${premiumFoods.length} premium items to ${restaurant.name}!`);
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

addPremiumItems();
