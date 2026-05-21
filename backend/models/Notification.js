const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['order', 'payment', 'offer', 'system'], 
    default: 'system' 
  },
  status: { type: String, enum: ['unread', 'read'], default: 'unread' },
  link: { type: String }, // Optional link to redirect user
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
