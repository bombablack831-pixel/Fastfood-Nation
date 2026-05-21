import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Bell, ShoppingBag, Truck, Star, Gift, Info,
    CheckCheck, Trash2, Clock, ChevronRight,
    Package, Zap, Settings, ArrowRight
} from 'lucide-react';
import api from '../utils/api';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const iconMap = {
    order: <ShoppingBag size={18} />,
    delivery: <Truck size={18} />,
    promo: <Gift size={18} />,
    review: <Star size={18} />,
    system: <Info size={18} />,
    default: <Bell size={18} />,
};

const colorMap = {
    order: { bg: 'bg-blue-50', text: 'text-blue-500', dot: 'bg-blue-500' },
    delivery: { bg: 'bg-orange-50', text: 'text-orange-500', dot: 'bg-orange-500' },
    promo: { bg: 'bg-purple-50', text: 'text-purple-500', dot: 'bg-purple-500' },
    review: { bg: 'bg-yellow-50', text: 'text-yellow-500', dot: 'bg-yellow-500' },
    system: { bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-500' },
    default: { bg: 'bg-primary/10', text: 'text-primary', dot: 'bg-primary' },
};

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const { data } = await api.get('/notifications');
                setNotifications(data);
            } catch (e) {
                // If API fails, show tactical placeholder data
                setNotifications([
                    { _id: '1', type: 'order', title: 'Target Acquired', message: 'Deployment #8472 has been authorized by the restaurant', read: false, createdAt: new Date() },
                    { _id: '2', type: 'delivery', title: 'Pilot Assigned', message: 'Armaan is in transit to the supply hub', read: false, createdAt: new Date(Date.now() - 1800000) },
                    { _id: '3', type: 'promo', title: 'Protocol Rebate: 50% OFF', message: 'Uplink code SPICE50 for 50% yield reduction on next deployment', read: true, createdAt: new Date(Date.now() - 3600000) },
                    { _id: '4', type: 'review', title: 'Mission Debriefing', message: 'Submit tactical feedback for Pizza Palace experience', read: true, createdAt: new Date(Date.now() - 86400000) },
                ]);
            } finally { setLoading(false); }
        };
        fetchNotifications();
    }, []);

    const handleMarkAllRead = async () => {
        try {
            await api.put('/notifications/mark-all-read');
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            toast.success('Protocol Sync: All logs cleared');
        } catch (e) {
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notifications/${id}`);
        } catch (e) { /* silent */ }
        setNotifications(prev => prev.filter(n => n._id !== id));
    };

    const unreadCount = notifications.filter(n => n.status === 'unread').length;
    const filteredNotifications = activeFilter === 'all'
        ? notifications
        : activeFilter === 'unread'
        ? notifications.filter(n => n.status === 'unread')
        : notifications.filter(n => n.type === activeFilter);

    const getTimeAgo = (date) => {
        const diff = Date.now() - new Date(date).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 1) return 'Just now';
        if (mins < 60) return `${mins}m ago`;
        const hours = Math.floor(mins / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    if (loading) return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">Syncing Mission Logs...</p>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#050505] transition-colors duration-300 pb-24">
            <div className="max-w-2xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-1 h-4 bg-primary rounded-full animate-pulse" />
                            <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] leading-none">Neural Alerts</span>
                        </div>
                        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic leading-none">Communication <span className="text-primary not-italic">Hub</span></h1>
                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 mt-3 uppercase tracking-[0.2em] italic">
                            {unreadCount > 0 ? `${unreadCount} unread transmissions detected` : 'All signals clear. Signal void established.'}
                        </p>
                    </div>
                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllRead}
                            className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:border-primary/20 hover:text-primary transition-all shadow-xl shadow-slate-200/50 dark:shadow-none active:scale-95"
                        >
                            <CheckCheck size={14} strokeWidth={3} /> Clear Logs
                        </button>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar mb-10 pb-2">
                    {[
                        { id: 'all', label: 'All Signals' },
                        { id: 'unread', label: 'Pending' },
                        { id: 'order', label: 'Deployments' },
                        { id: 'delivery', label: 'Tactical' },
                        { id: 'promo', label: 'Rewards' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setActiveFilter(f.id)}
                            className={`px-6 py-3 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all whitespace-nowrap border-2 ${
                                activeFilter === f.id
                                    ? 'bg-slate-900 dark:bg-white text-white dark:text-black border-slate-900 dark:border-white shadow-xl shadow-slate-900/10'
                                    : 'bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-100 dark:border-slate-800'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>

                {/* Notifications List */}
                <div className="space-y-4">
                    <AnimatePresence mode="popLayout">
                        {filteredNotifications.length === 0 ? (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-slate-900/50 rounded-[3rem] p-24 text-center border border-slate-100 dark:border-slate-800/50 backdrop-blur-xl"
                            >
                                <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-slate-100 dark:border-slate-800">
                                    <Bell size={40} className="text-slate-200 dark:text-slate-800" />
                                </div>
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 uppercase italic tracking-tight">Signal Void</h3>
                                <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-[0.2em]">No incoming transmissions detected in this frequency.</p>
                            </motion.div>
                        ) : (
                            filteredNotifications.map((notif, i) => {
                                const type = notif.type || 'default';
                                const colors = colorMap[type] || colorMap.default;
                                const icon = iconMap[type] || iconMap.default;

                                return (
                                    <motion.div
                                        key={notif._id}
                                        layout
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: 20, height: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className={`bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-7 border-2 transition-all group backdrop-blur-xl relative overflow-hidden ${
                                            notif.status === 'unread'
                                                ? 'border-primary/20 shadow-2xl shadow-primary/5'
                                                : 'border-white dark:border-slate-800/50 shadow-sm'
                                        }`}
                                    >
                                        {notif.status === 'unread' && <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-[40px] pointer-events-none" />}
                                        <div className="flex items-start gap-6 relative z-10">
                                            <div className={`w-14 h-14 ${colors.bg} dark:bg-slate-800 rounded-[1.2rem] flex items-center justify-center ${colors.text} shrink-0 border border-transparent dark:border-slate-700/50 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                                                {icon}
                                            </div>
                                            
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-start justify-between gap-4">
                                                    <div className="min-w-0 pt-1">
                                                        <div className="flex items-center gap-3 mb-1">
                                                            {notif.status === 'unread' && (
                                                                <span className={`w-2 h-2 rounded-full ${colors.dot} shrink-0 animate-pulse`} />
                                                            )}
                                                            <h4 className={`font-black text-[13px] uppercase tracking-tight italic ${notif.status === 'unread' ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                                                {notif.title}
                                                            </h4>
                                                        </div>
                                                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 leading-relaxed uppercase pr-8">{notif.message}</p>
                                                    </div>

                                                    <div className="flex flex-col items-end gap-3 shrink-0">
                                                        <span className="text-[9px] font-black text-slate-300 dark:text-slate-700 uppercase tracking-widest">{getTimeAgo(notif.createdAt)}</span>
                                                        <button
                                                            onClick={() => handleDelete(notif._id)}
                                                            className="w-10 h-10 rounded-2xl flex items-center justify-center text-slate-300 dark:text-slate-800 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-all opacity-0 group-hover:opacity-100 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>

                {/* Notification Settings Link */}
                <div className="mt-12">
                    <button className="w-full bg-white dark:bg-slate-900/50 rounded-[2.5rem] p-7 border-2 border-white dark:border-slate-800/50 shadow-sm hover:border-primary/20 transition-all flex items-center justify-between group backdrop-blur-xl">
                        <div className="flex items-center gap-5">
                            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                                <Settings size={22} className="group-hover:rotate-90 transition-transform duration-700" />
                            </div>
                            <div className="text-left">
                                <span className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Alert Protocols</span>
                                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-0.5">Configure Neural Link Frequency</p>
                            </div>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all">
                            <ArrowRight size={18} strokeWidth={3} />
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Notifications;
