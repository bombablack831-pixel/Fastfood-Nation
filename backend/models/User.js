const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['customer', 'owner', 'delivery', 'admin'], 
    default: 'customer' 
  },
  
  // Owner Specific Fields
  restaurantName: { type: String },
  restaurantAddress: { type: String },

  // Delivery Specific Fields
  vehicleType: { type: String },
  licenseNumber: { type: String },
  addresses: [
    {
      label: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
      fullAddress: { type: String, required: true },
      location: {
        type: { type: String, enum: ['Point'], default: 'Point' },
        coordinates: { type: [Number] } // [lng, lat]
      },
      isDefault: { type: Boolean, default: false }
    }
  ],
  phone: { type: String },
  profilePicture: { type: String },
  googleId: { type: String },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Food' }],
  
  // New Premium Features
  walletBalance: { type: Number, default: 0 },
  referralCode: { type: String, unique: true },
  referredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  loyaltyPoints: { type: Number, default: 0 },
  isVIP: { type: Boolean, default: false },
  vipExpiry: { type: Date },
  refreshToken: { type: String, select: false },
  fcmToken: { type: String },
  otpCode: { type: String },
  otpExpires: { type: Date },

  // Rider/Delivery Specific Analytics & Tracking
  rating: { type: Number, default: 4.5 },
  reviewsCount: { type: Number, default: 0 },
  status: { type: String, enum: ['available', 'busy', 'offline'], default: 'offline' },
  currentLocation: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [72.3361, 24.1030] } // Default: Kanodar
  }
}, { timestamps: true });

// Generate referral code on first save
userSchema.pre('save', async function() {
  if (this.isNew || !this.referralCode) {
    this.referralCode = 'FF' + Math.random().toString(36).substring(2, 8).toUpperCase();
  }
  
  // Set default status for delivery if not set
  if (this.isNew && this.role === 'delivery') {
    this.status = 'available';
  }
});

userSchema.pre('save', async function() {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.getResetPasswordToken = function() {
  const crypto = require('crypto');
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.resetPasswordExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

module.exports = mongoose.model('User', userSchema);
