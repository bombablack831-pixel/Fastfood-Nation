const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['credit', 'debit'], 
    required: true 
  },
  purpose: { 
    type: String, 
    enum: ['topup', 'order_payment', 'referral_bonus', 'cashback', 'subscription_purchase'],
    required: true
  },
  status: { 
    type: String, 
    enum: ['pending', 'completed', 'failed'], 
    default: 'completed' 
  },
  referenceId: { type: String }, // Can be Order ID or Payment ID
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
