const Notification = require('../models/Notification');
const { sendPushNotification } = require('./pushNotificationService');

/**
 * Unified Notification Service
 * Handles:
 * 1. Database persistence
 * 2. Real-time Socket.io emit
 * 3. Firebase Push Notifications
 */
class NotificationService {
    async createNotification(userId, { title, message, type, link }, io) {
        try {
            // 1. Save to Database
            const notification = await Notification.create({
                user: userId,
                title,
                message,
                type,
                link
            });

            // 2. Real-time Socket Emit
            if (io) {
                // Emit to specific user room (userId)
                io.to(userId.toString()).emit('new_notification', notification);
                console.log(`Socket notification sent to user: ${userId}`);
            }

            // 3. Firebase Push
            await sendPushNotification(userId, title, message, { link: link || '' });

            return notification;
        } catch (error) {
            console.error('Notification Service Error:', error);
        }
    }

    async markAsRead(notificationId) {
        return await Notification.findByIdAndUpdate(notificationId, { status: 'read' }, { new: true });
    }

    async getUnreadCount(userId) {
        return await Notification.countDocuments({ user: userId, status: 'unread' });
    }
}

module.exports = new NotificationService();
