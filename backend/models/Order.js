const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  restaurant: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  items: [
    {
      food: { type: mongoose.Schema.Types.ObjectId, ref: 'Food' },
      quantity: { type: Number, required: true },
      price: { type: Number }
    }
  ],
  subtotal: { type: Number, default: 0 },
  taxPrice: { type: Number, default: 0 },
  deliveryPrice: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid', 'failed'], 
    default: 'pending' 
  },
  paymentMethod: { type: String },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  deliveryBoy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  deliveryAddress: { type: String, required: true },
  deliveryLocation: {
    lat: Number,
    lng: Number
  }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
