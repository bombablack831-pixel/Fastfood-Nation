const Razorpay = require('razorpay');
const crypto = require('crypto');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

/**
 * Create a Razorpay Order
 * @param {number} amount - Amount in INR
 * @param {string} receipt - Unique receipt ID (usually order ID)
 * @returns {Promise<Object>} - Razorpay order object
 */
const createRazorpayOrder = async (amount, receipt) => {
  if (process.env.RAZORPAY_KEY_ID === 'your_razorpay_key_id' || !process.env.RAZORPAY_KEY_ID) {
    return {
      id: "dummy_order_" + Math.random().toString(36).substring(7),
      amount: Math.round(amount * 100),
      currency: 'INR',
      receipt: receipt
    };
  }

  const options = {
    amount: Math.round(amount * 100), // Amount in paise
    currency: 'INR',
    receipt: receipt,
  };

  try {
    const order = await razorpay.orders.create(options);
    return order;
  } catch (error) {
    console.error('Razorpay Order Creation Error:', error);
    throw new Error('Failed to create Razorpay order');
  }
};

/**
 * Verify Razorpay Payment Signature
 * @param {string} razorpayOrderId 
 * @param {string} razorpayPaymentId 
 * @param {string} razorpaySignature 
 * @returns {boolean}
 */
const verifySignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const body = razorpayOrderId + "|" + razorpayPaymentId;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body.toString())
    .digest('hex');

  return expectedSignature === razorpaySignature;
};

/**
 * Verify Webhook Signature
 * @param {string} payload - Raw body from request
 * @param {string} signature - x-razorpay-signature header
 * @returns {boolean}
 */
const verifyWebhookSignature = (payload, signature) => {
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(payload))
    .digest('hex');
  
  return expectedSignature === signature;
};

module.exports = {
  createRazorpayOrder,
  verifySignature,
  verifyWebhookSignature
};
