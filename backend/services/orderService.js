const orderRepository = require('../repositories/orderRepository');
const paymentService = require('./paymentService');
const notificationService = require('./notificationService');
const User = require('../models/User');
const Transaction = require('../models/Transaction');
const AppError = require('../utils/appError');

/**
 * Order Service
 * Orchestrates business logic for order processing.
 */
class OrderService {
  async placeNewOrder(user, orderData, io) {
    const { paymentMethod, totalAmount } = orderData;
    
    // 1. Create Order record
    const order = await orderRepository.create({
      ...orderData,
      customer: user._id,
      paymentStatus: 'pending'
    });

    // 2. Handle Wallet Payment Logic
    if (paymentMethod === 'wallet') {
        const dbUser = await User.findById(user._id);
        if (dbUser.walletBalance < totalAmount) {
            throw new AppError('Insufficient wallet balance', 400);
        }
        
        dbUser.walletBalance -= totalAmount;
        order.paymentStatus = 'paid';
        
        await Transaction.create({
            user: user._id,
            amount: totalAmount,
            type: 'debit',
            purpose: 'order_payment',
            description: `Payment for order ${order._id}`
        });

        // Loyalty Points
        const pointsEarned = Math.floor(totalAmount / 10);
        dbUser.loyaltyPoints += pointsEarned;
        
        await dbUser.save();
        await order.save();

        if (io) {
            await this.emitNewOrder(io, order);
        }

        await this.notifyOrderPlacement(user._id, order);
        return { order, pointsEarned };
    }

    // 3. Handle Razorpay Payment Logic
    if (paymentMethod === 'online') {
        const razorOrder = await paymentService.createRazorpayOrder(totalAmount, order._id.toString());
        order.razorpayOrderId = razorOrder.id;
        await order.save();

        if (io && razorOrder.id.startsWith('dummy_')) {
            await this.emitNewOrder(io, order);
        }

        return { 
            order, 
            razorOrderId: razorOrder.id,
            amount: razorOrder.amount,
            currency: razorOrder.currency
        };
    }

    // 4. Handle COD
    await order.save();

    // Notify Restaurant and Riders
    if (io) {
        await this.emitNewOrder(io, order);
    }

    await this.notifyOrderPlacement(user._id, order, io);
    return { order };
  }

  async emitNewOrder(io, order) {
    // 1. Populate the order fully before sending to frontend
    const populatedOrder = await order.populate([
        { path: 'customer', select: 'name email phone' },
        { path: 'items.food', select: 'name price image' },
        { path: 'restaurant', select: 'name address' }
    ]);

    const roomName = `restaurant_${order.restaurant._id || order.restaurant}`;
    io.to(roomName).emit('new_order', populatedOrder);
    console.log(`Real-time new_order notification sent to room: ${roomName}`);
  }

  emitAvailableToRiders(io, order) {
    // Notify all available riders that an order is ready to be picked up
    io.to('riders').emit('order_available', order);
    console.log(`Real-time order_available notification sent for Order ${order._id} to riders`);
  }

  async verifyOrderPayment(paymentData, io) {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = paymentData;

    const isVerified = paymentService.verifySignature(
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature
    );

    if (!isVerified) throw new AppError('Invalid payment signature', 400);

    const order = await orderRepository.findByRazorpayId(razorpay_order_id);
    if (!order) throw new AppError('Order not found', 404);

    order.paymentStatus = 'paid';
    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.status = 'placed';
    await order.save();

    // Give points to user
    const user = await User.findById(order.customer);
    const pointsEarned = Math.floor(order.totalAmount / 10);
    user.loyaltyPoints += pointsEarned;
    await user.save();

    await this.notifyPaymentSuccess(order.customer, order, io);

    // Notify Restaurant and Riders for Online Payment
    if (io) {
        await this.emitNewOrder(io, order);
    }

    return order;
  }

  async updateStatus(orderId, statusData, io) {
    const { status, deliveryBoy } = statusData;
    const order = await orderRepository.findById(orderId);
    if (!order) throw new AppError('Order not found', 404);

    if (status) {
        order.status = status;
        await this.handleStatusNotifications(order, status, io);
        
        // Emit Socket Event
        if (io) {
            const orderRoom = `order_${order._id}`;
            const restaurantRoom = `restaurant_${order.restaurant._id || order.restaurant}`;
            
            io.to(orderRoom).emit('status_update', {
                orderId: order._id,
                status: order.status,
                timestamp: new Date()
            });

            io.to('admin_monitoring').emit('admin_status_update', {
                orderId: order._id,
                status: order.status
            });

            // Broadcast to riders when restaurant accepts the order or moves to preparing
            if (['confirmed', 'preparing'].includes(status) && !order.deliveryBoy) {
                this.emitAvailableToRiders(io, order);
            }
        }
    }
    
    if (deliveryBoy) order.deliveryBoy = deliveryBoy;

    await order.save();
    return order;
  }

  // Helpers
  async notifyOrderPlacement(userId, order, io) {
      // 1. Notify Customer
      await notificationService.createNotification(userId, {
          title: 'Order Placed! 🍔',
          message: `Your order #${order._id.toString().slice(-6).toUpperCase()} has been received.`,
          type: 'order',
          link: `/track/${order._id}`
      }, io);

      // 2. Notify Restaurant Owner
      try {
          const Restaurant = require('../models/Restaurant');
          const restaurant = await Restaurant.findById(order.restaurant);
          if (restaurant && restaurant.owner) {
              await notificationService.createNotification(restaurant.owner, {
                  title: 'New Mission! 🚨',
                  message: `New order #${order._id.toString().slice(-6).toUpperCase()} received. Check your dashboard.`,
                  type: 'order',
                  link: `/dashboard/orders`
              }, io);
              console.log(`Alerted restaurant owner ${restaurant.owner} about new order`);
          }
      } catch (err) {
          console.error('Failed to notify restaurant owner:', err);
      }
  }

  async notifyPaymentSuccess(userId, order, io) {
      const title = 'Payment Successful! ✅';
      const message = `Payment for order #${order._id.toString().slice(-6).toUpperCase()} verified.`;
      
      await notificationService.createNotification(userId, {
          title, message, type: 'order', link: `/track/${order._id}`
      }, io);
  }

  async handleStatusNotifications(order, status, io) {
    const statusMap = {
        placed: { title: 'Order Placed! 🍔', message: 'Your order has been received.' },
        confirmed: { title: 'Order Accepted! ✅', message: 'The restaurant has accepted your order.' },
        preparing: { title: 'Chef is Cooking! 👨‍🍳', message: 'Your food is being prepared.' },
        picked_up: { title: 'Order Picked Up! 🥡', message: 'Your rider has picked up your meal.' },
        out_for_delivery: { title: 'On The Way! 🛵', message: 'Your rider is heading to your location.' },
        delivered: { title: 'Delivered! 🎉', message: 'Enjoy your meal!' }
    };

    const config = statusMap[status];
    if (config) {
        await notificationService.createNotification(order.customer, {
            title: config.title,
            message: config.message,
            type: 'order',
            link: `/track/${order._id}`
        }, io);
    }
  }

  async processWebhook(body, signature) {
    const isValid = paymentService.verifyWebhookSignature(body, signature);
    if (!isValid) throw new AppError('Invalid signature', 400);

    const event = body.event;
    const payload = body.payload.payment.entity;

    if (event === 'payment.captured') {
        const order = await orderRepository.findByRazorpayId(payload.order_id);
        if (order && order.paymentStatus !== 'paid') {
            order.paymentStatus = 'paid';
            order.razorpayPaymentId = payload.id;
            await order.save();
        }
    } else if (event === 'payment.failed') {
        const order = await orderRepository.findByRazorpayId(payload.order_id);
        if (order) {
            order.paymentStatus = 'failed';
            await order.save();
        }
    }
    return 'ok';
  }
}

module.exports = new OrderService();
