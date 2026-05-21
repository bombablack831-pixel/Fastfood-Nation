const Notification = require('../models/Notification');

const createNotification = async (userId, title, message, type = 'system', link = '') => {
  try {
    await Notification.create({
      user: userId,
      title,
      message,
      type,
      link
    });
    // In a real app, you might also emit a socket.io event here
    // global.io.to(userId.toString()).emit('new_notification', notification);
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};

module.exports = { createNotification };
