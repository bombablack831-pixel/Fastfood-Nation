import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Package, Gift, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { socket, connectSocket } from '../utils/socket';

const NotificationDropdown = () => {
    const { isAuthenticated, user: userInfo } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const fetchNotifications = async () => {
        // Only fetch if user is logged in
        if (!isAuthenticated) return;

        try {
            const { data } = await api.get('/notifications');
            setNotifications(data || []);
        } catch (error) {
            // Silently fail - user may have just logged out
            setNotifications([]);
        }
    };

    useEffect(() => {
        if (!isAuthenticated) {
            setNotifications([]);
            return;
        }

        const s = connectSocket();

        if (userInfo) {
            s.emit('join_user', userInfo._id);
        }

        s.on('new_notification', (newNotif) => {
            setNotifications(prev => [newNotif, ...prev]);
            // Optional: Play sound or vibrate
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2358/2358-preview.mp3');
            audio.play().catch(e => {
                console.log('Audio notification skipped: blocked by browser or dead link');
            });
        });

        fetchNotifications();
        
        return () => {
            socket.off('new_notification');
        };
    }, [isAuthenticated, userInfo]);

    useEffect(() => {
        const handler = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, []);

    const unreadCount = notifications.filter(n => n.status === 'unread').length;

    const getIcon = (type) => {
        switch (type) {
            case 'order': return <Package className="text-primary" size={16} />;
            case 'payment': return <Zap className="text-blue-500" size={16} />;
            case 'offer': return <Gift className="text-orange-500" size={16} />;
            default: return <Info className="text-slate-400" size={16} />;
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center border border-slate-100 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors relative"
            >
                <Bell size={20} className={`transition-colors ${isOpen ? 'text-primary' : 'text-slate-600 dark:text-slate-300'}`} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 bg-primary rounded-full border-2 border-white dark:border-slate-800 text-[10px] font-bold text-white flex items-center justify-center">
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden z-50"
                    >
                        <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
                            <h4 className="text-sm font-bold text-slate-900 dark:text-white">Notifications</h4>
                            <Link to="/notifications" onClick={() => setIsOpen(false)} className="text-xs font-bold text-primary hover:underline">View All</Link>
                        </div>

                        <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="py-8 px-4 text-center">
                                    <Bell size={24} className="text-slate-300 dark:text-slate-600 mx-auto mb-2" />
                                    <p className="text-sm font-medium text-slate-500">No new notifications</p>
                                </div>
                            ) : (
                                notifications.slice(0, 5).map((n) => (
                                    <Link 
                                        key={n._id}
                                        to={n.link || '/notifications'}
                                        onClick={() => setIsOpen(false)}
                                        className={`flex gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors border-b border-slate-50 dark:border-slate-700 last:border-0 ${n.status === 'unread' ? 'bg-primary/5 dark:bg-primary/10' : ''}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${n.status === 'unread' ? 'bg-primary/10 text-primary' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                                            {getIcon(n.type)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm tracking-tight truncate ${n.status === 'unread' ? 'font-bold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'}`}>{n.title}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">{new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>

                        {notifications.length > 5 && (
                            <div className="border-t border-slate-100 dark:border-slate-700">
                                <Link 
                                    to="/notifications" 
                                    onClick={() => setIsOpen(false)}
                                    className="block p-3 text-center text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors bg-slate-50 dark:bg-slate-800/50"
                                >
                                    View {notifications.length - 5} more updates
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;
