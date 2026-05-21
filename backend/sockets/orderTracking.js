/**
 * Socket.io Handler for Order Tracking
 * Manages order rooms and real-time location/status updates.
 */

module.exports = (io, socket) => {
  // 1. Join Order Room (Customer/Rider/Admin)
  socket.on('join_order', (orderId) => {
    const room = `order_${orderId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined order room: ${room}`);
  });

  // 2. Join Restaurant Room (Restaurant Owner)
  socket.on('join_restaurant', (restaurantId) => {
    const room = `restaurant_${restaurantId}`;
    socket.join(room);
    console.log(`Socket ${socket.id} joined restaurant room: ${room}`);
  });

  // 3. Join Riders Room (All active delivery boys)
  socket.on('join_riders', () => {
    socket.join('riders');
    console.log(`Socket ${socket.id} joined riders network`);
  });

  // 4. Join Admin Room (Monitoring all orders)
  socket.on('join_admin', () => {
    socket.join('admin_monitoring');
    console.log(`Socket ${socket.id} joined admin monitoring room`);
  });

  // 5. Update Delivery Location
  // Sent by Delivery Partner
  socket.on('update_location', (data) => {
    const { orderId, location, heading } = data;
    const room = `order_${orderId}`;
    
    // Broadcast to everyone in the room (the customer and potentially admin)
    io.to(room).emit('location_update', {
      orderId,
      location, // { lat, lng }
      heading,  
      timestamp: new Date()
    });

    // Also notify admin monitoring
    io.to('admin_monitoring').emit('rider_location_update', {
      orderId,
      location,
      heading
    });
    
    console.log(`Location update for order ${orderId}:`, location);
  });

  // 6. Manual Status Update Trigger
  socket.on('update_status', (data) => {
    const { orderId, status, restaurantId } = data;
    const room = `order_${orderId}`;
    
    io.to(room).emit('status_update', {
      orderId,
      status,
      timestamp: new Date()
    });

    // Notify restaurant if status is changed by delivery or system
    if (restaurantId) {
      io.to(`restaurant_${restaurantId}`).emit('order_status_changed', { orderId, status });
    }

    // Notify admin
    io.to('admin_monitoring').emit('admin_status_update', { orderId, status });
  });

  // 7. New Order Notification (Triggered from Service, but could be reinforced here)
  socket.on('new_order_placed', (order) => {
    const room = `restaurant_${order.restaurant}`;
    io.to(room).emit('new_order', order);
    io.to('admin_monitoring').emit('new_order_alert', order);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from tracking:', socket.id);
  });
};
