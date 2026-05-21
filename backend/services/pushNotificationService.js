const { admin } = require('../config/firebase');
const User = require('../models/User');

/**
 * Send Push Notification to a Specific User
 * @param {string} userId - ID of the user to notify
 * @param {string} title - Notification title
 * @param {string} body - Notification body
 * @param {Object} data - Optional data payload
 */
const sendPushNotification = async (userId, title, body, data = {}) => {
    try {
        const user = await User.findById(userId).select('fcmToken');
        
        if (!user || !user.fcmToken) {
            console.log(`No FCM token found for user: ${userId}`);
            return;
        }

        const message = {
            notification: {
                title,
                body,
            },
            data: {
                ...data,
                click_action: 'FLUTTER_NOTIFICATION_CLICK', // Change as per your frontend needs
            },
            token: user.fcmToken,
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent push notification:', response);
        return response;
    } catch (error) {
        console.error('Error sending push notification:', error);
        
        // Handle invalid token (e.g., token expired or revoked)
        if (error.code === 'messaging/registration-token-not-registered') {
            console.log('FCM token is no longer valid. Removing from user...');
            await User.findByIdAndUpdate(userId, { $unset: { fcmToken: 1 } });
        }
    }
};

/**
 * Send Push Notification to Multiple Users (Topics)
 * @param {string} topic - Topic name (e.g., 'all_users', 'delivery_boys')
 * @param {string} title 
 * @param {string} body 
 */
const sendTopicNotification = async (topic, title, body, data = {}) => {
    try {
        const message = {
            notification: { title, body },
            data,
            topic: topic,
        };

        const response = await admin.messaging().send(message);
        console.log('Successfully sent topic notification:', response);
        return response;
    } catch (error) {
        console.error('Error sending topic notification:', error);
    }
};

module.exports = {
    sendPushNotification,
    sendTopicNotification,
};
