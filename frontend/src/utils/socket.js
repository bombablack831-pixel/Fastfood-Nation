import { io } from 'socket.io-client';

const SOCKET_URL = 'http://192.168.0.170:5000';

export const socket = io(SOCKET_URL, {
    transports: ['websocket', 'polling'],
    autoConnect: false, // Don't connect immediately
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 1000,
});

export const connectSocket = () => {
    if (!socket.connected) {
        socket.connect();
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket.connected) {
        socket.disconnect();
    }
};
