const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

async function checkUser() {
  try {
    // Try to load env from different possible paths
    dotenv.config({ path: './.env' });
    if (!process.env.MONGODB_URI) {
        dotenv.config({ path: '../.env' });
    }

    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'admin@example.com';
    const user = await User.findOne({ email });

    if (user) {
      console.log('\n👤 User Found:', {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      }, '\n');
    } else {
      console.log(`\n❌ User ${email} not found.\n`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkUser();
