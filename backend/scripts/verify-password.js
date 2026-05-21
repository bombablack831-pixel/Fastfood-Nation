const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const User = require('../models/User');

// Load env from one level up since this script is in /scripts
dotenv.config({ path: './.env' }); 
// Note: If running from root, use './.env', if from scripts use '../.env'
// To be safe, we'll try to find it.

async function checkPass() {
  try {
    // Try to load env if not loaded
    if (!process.env.MONGODB_URI) {
        dotenv.config({ path: '../.env' });
    }
    
    await mongoose.connect(process.env.MONGODB_URI);
    const email = 'admin@example.com';
    const user = await User.findOne({ email });

    if (user) {
      const isMatch = await bcrypt.compare('password123', user.password);
      console.log(`\n✅ Password match for ${email}: ${isMatch}\n`);
    } else {
      console.log(`\n❌ User ${email} not found.\n`);
    }
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkPass();
