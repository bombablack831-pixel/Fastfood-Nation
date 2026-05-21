/**
 * Push Notification Utility for Order Status Updates
 */

export const requestNotificationPermission = async () => {
  if (!('Notification' in window)) {
    console.log('This browser does not support notifications');
    return false;
  }

  if (Notification.permission === 'granted') return true;

  if (Notification.permission !== 'denied') {
    const permission = await Notification.requestPermission();
    return permission === 'granted';
  }

  return false;
};

export const sendOrderNotification = (title, body, options = {}) => {
  if (Notification.permission !== 'granted') return;

  const notification = new Notification(title, {
    body,
    icon: '/logo.png',
    badge: '/logo.png',
    vibrate: [200, 100, 200],
    tag: 'order-update', // replaces previous notification with same tag
    ...options,
  });

  notification.onclick = () => {
    window.focus();
    window.location.href = '/orders';
    notification.close();
  };

  // Auto-close after 5 seconds
  setTimeout(() => notification.close(), 5000);
};

export const ORDER_STATUS_MESSAGES = {
  placed: {
    title: '✅ Order Confirmed!',
    body: 'Your order has been received and is being prepared.',
  },
  preparing: {
    title: '👨‍🍳 Chef is Cooking!',
    body: 'The kitchen has started preparing your delicious meal.',
  },
  out_for_delivery: {
    title: '🛵 On the Way!',
    body: 'Your rider has picked up your order and is heading your way.',
  },
  delivered: {
    title: '🎉 Delivered!',
    body: 'Your order has been delivered. Enjoy your meal!',
  },
};
