const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

const updateUserRole = async (email, newRole) => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const user = await User.findOneAndUpdate(
            { email: email.toLowerCase() },
            { role: newRole },
            { new: true }
        );

        if (!user) {
            console.log('User not found');
        } else {
            console.log(`Success! User ${user.email} is now role: ${user.role}`);
        }
    } catch (err) {
        console.error('Error updating user:', err);
    } finally {
        await mongoose.disconnect();
    }
};

const email = process.argv[2];
const role = process.argv[3] || 'delivery';

if (!email) {
    console.log('Please provide an email: node update-user-role.js <email> <role>');
    process.exit(1);
}

updateUserRole(email, role);
