const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/auth');

// @desc    Get wallet balance and transaction history
// @route   GET /api/wallet
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('walletBalance loyaltyPoints referralCode');
    const transactions = await Transaction.find({ user: req.user._id }).sort({ createdAt: -1 });
    
    res.json({
      balance: user.walletBalance,
      loyaltyPoints: user.loyaltyPoints,
      referralCode: user.referralCode,
      transactions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add money to wallet (Simulation)
// @route   POST /api/wallet/topup
// @access  Private
router.post('/topup', protect, async (req, res) => {
  const { amount } = req.body;
  
  if (!amount || amount <= 0) {
    return res.status(400).json({ message: 'Invalid amount' });
  }

  try {
    const user = await User.findById(req.user._id);
    user.walletBalance += Number(amount);
    await user.save();

    const transaction = await Transaction.create({
      user: req.user._id,
      amount,
      type: 'credit',
      purpose: 'topup',
      description: 'Money added to wallet'
    });

    res.json({
      message: 'Wallet topped up successfully',
      balance: user.walletBalance,
      transaction
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Redeem loyalty points for wallet balance
// @route   POST /api/wallet/redeem-points
// @access  Private
router.post('/redeem-points', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        
        if (user.loyaltyPoints < 100) {
            return res.status(400).json({ message: 'Minimum 100 points required to redeem' });
        }

        const redemptionAmount = Math.floor(user.loyaltyPoints / 10); // 10 points = ₹1
        const pointsRedeemed = redemptionAmount * 10;

        user.walletBalance += redemptionAmount;
        user.loyaltyPoints -= pointsRedeemed;
        await user.save();

        await Transaction.create({
            user: req.user._id,
            amount: redemptionAmount,
            type: 'credit',
            purpose: 'cashback',
            description: `Redeemed ${pointsRedeemed} loyalty points`
        });

        res.json({
            message: `Redeemed ${pointsRedeemed} points for ₹${redemptionAmount}`,
            balance: user.walletBalance,
            loyaltyPoints: user.loyaltyPoints
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Buy VIP Fastpass (zero delivery fee subscription)
// @route   POST /api/wallet/buy-vip
// @access  Private
router.post('/buy-vip', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const vipPrice = 149; // Fixed price for 30 days

        if (user.walletBalance < vipPrice) {
            return res.status(400).json({ message: 'Insufficient wallet balance' });
        }

        user.walletBalance -= vipPrice;
        user.isVIP = true;
        
        // Extend if already VIP, else start from now
        const baseDate = (user.vipExpiry && user.vipExpiry > Date.now()) ? user.vipExpiry : Date.now();
        user.vipExpiry = new Date(new Date(baseDate).getTime() + 30 * 24 * 60 * 60 * 1000);
        
        await user.save();

        await Transaction.create({
            user: user._id,
            amount: vipPrice,
            type: 'debit',
            purpose: 'subscription_purchase',
            description: 'Fastpass Gold (30 Days)'
        });

        res.json({
            message: 'Fastpass Gold activated! Enjoy free deliveries.',
            isVIP: user.isVIP,
            vipExpiry: user.vipExpiry,
            balance: user.walletBalance
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
