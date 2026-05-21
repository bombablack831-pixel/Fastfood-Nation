import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box, ShoppingBag, TrendingUp, Star, Clock,
    Bell, Zap, Users, ArrowRight, Loader2, RefreshCcw,
    DollarSign, ChefHat, Utensils, Activity, Eye, BarChart3,
    ChevronRight, ShoppingCart
} from 'lucide-react';
import api from '../utils/api';
import RestaurantLayout from '../layouts/RestaurantLayout';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { socket, connectSocket } from '../utils/socket';

const statusColors = {
    placed: 'bg-blue-500',
    confirmed: 'bg-indigo-500',
    preparing: 'bg-amber-500',
    picked_up: 'bg-orange-500',
    out_for_delivery: 'bg-purple-500',
    delivered: 'bg-emerald-500',
    cancelled: 'bg-rose-500',
};

const statusLabels = {
    placed: 'New',
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    picked_up: 'Picked Up',
    out_for_delivery: 'On Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
};

const Dashboard = () => {
    const [orders, setOrders] = useState([]);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newOrderAlert, setNewOrderAlert] = useState(false);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const { data: resData } = await api.get('/restaurants/owner/me');
                setRestaurant(resData);

                const { data: ordersData } = await api.get(`/orders/restaurant/${resData._id}`);
                setOrders(ordersData);

                // Socket setup
                const s = connectSocket();
                s.emit('join_restaurant', resData._id);
                s.on('new_order', (newOrder) => {
                    console.log('New Order Event:', newOrder);
                    setOrders(prev => [newOrder, ...prev]);
                    setNewOrderAlert(true);
                    toast.info('🔔 New Order Received!', { position: 'top-center' });
                    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3');
                    audio.play().catch(e => {
                        console.log('Audio alert skipped');
                    });
                    setTimeout(() => setNewOrderAlert(false), 5000);
                });

                setLoading(false);
            } catch (err) {
                console.error('Failed to load dashboard:', err);
                setLoading(false);
            }
        };
        fetchDashboardData();
        return () => { 
            socket.off('new_order');
        };
    }, []);

    const toggleStatus = async () => {
        try {
            const { data } = await api.put('/restaurants/owner/toggle-status');
            setRestaurant(data);
            toast.success(`Restaurant is now ${data.isOpened ? 'ONLINE' : 'OFFLINE'}`);
        } catch (e) { toast.error('Status sync failed'); }
    };

    const handleQuickAction = async (orderId, status) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
            toast.success(`Order ${status.replace('_', ' ')}!`);
        } catch (e) { toast.error('Update failed'); }
    };

    if (loading) return (
        <RestaurantLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary" size={40} />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Loading Dashboard...</p>
            </div>
        </RestaurantLayout>
    );

    const dailyOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
    const newOrders = orders.filter(o => o.status === 'placed');
    const preparingOrders = orders.filter(o => o.status === 'preparing');
    const deliveredOrders = orders.filter(o => o.status === 'delivered');
    const dailyEarnings = dailyOrders.filter(o => o.status === 'delivered').reduce((acc, o) => acc + o.totalAmount, 0);
    const weeklyEarnings = orders.filter(o => {
        const d = new Date(o.createdAt);
        const now = new Date();
        return o.status === 'delivered' && (now - d) < 7 * 24 * 60 * 60 * 1000;
    }).reduce((acc, o) => acc + o.totalAmount, 0);

    return (
        <RestaurantLayout>
            <div className="space-y-8">
                {/* New Order Alert */}
                <AnimatePresence>
                    {newOrderAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-emerald-500/20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-bounce">
                                    <Bell size={20} />
                                </div>
                                <div>
                                    <p className="font-black text-sm">New Order Just Arrived!</p>
                                    <p className="text-[10px] font-bold text-white/80">Check your orders tab to accept</p>
                                </div>
                            </div>
                            <Link to="/dashboard/orders" className="bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all">
                                View →
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Hub Status Card */}
                <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20" />
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/5 rounded-full blur-2xl" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative z-10">
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 italic">Control Center</p>
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">
                                {restaurant?.name || 'My Kitchen'}
                            </h1>
                            <div className="flex items-center gap-3 mt-3">
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star size={14} fill="currentColor" />
                                    <span className="text-sm font-black text-slate-700">{restaurant?.rating?.toFixed(1) || '4.8'}</span>
                                </div>
                                <span className="w-1 h-1 bg-slate-300 rounded-full" />
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                                    {dailyOrders.length} orders today
                                </span>
                            </div>
                        </div>

                        <button
                            onClick={toggleStatus}
                            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all duration-500 flex items-center gap-3 border ${
                                restaurant?.isOpened
                                ? 'bg-emerald-500 text-white border-emerald-400 shadow-lg shadow-emerald-500/30'
                                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                            }`}
                        >
                            <span className={`w-2.5 h-2.5 rounded-full ${restaurant?.isOpened ? 'bg-white animate-pulse' : 'bg-slate-400'}`} />
                            {restaurant?.isOpened ? 'Hub Online' : 'Hub Offline'}
                        </button>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'New Orders', value: newOrders.length, icon: <Bell size={20} />, gradient: 'from-blue-500 to-indigo-500', shadow: 'shadow-blue-500/20' },
                        { label: 'Preparing', value: preparingOrders.length, icon: <Utensils size={20} />, gradient: 'from-amber-500 to-orange-500', shadow: 'shadow-amber-500/20' },
                        { label: "Today's Revenue", value: `₹${dailyEarnings.toLocaleString()}`, icon: <DollarSign size={20} />, gradient: 'from-emerald-500 to-teal-500', shadow: 'shadow-emerald-500/20' },
                        { label: 'Week Revenue', value: `₹${weeklyEarnings.toLocaleString()}`, icon: <TrendingUp size={20} />, gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/20' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white dark:bg-slate-800 rounded-[2rem] p-6 border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg ${stat.shadow} group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter">{stat.value}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Main Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Recent Orders - 2 cols */}
                    <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-[2.5rem] p-8 border border-slate-100 dark:border-slate-700">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 h-6 bg-primary rounded-full" />
                                <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Recent Orders</h2>
                            </div>
                            <Link to="/dashboard/orders" className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-widest hover:translate-x-1 transition-transform">
                                View All <ChevronRight size={12} />
                            </Link>
                        </div>

                        {/* Quick Action Orders (New orders needing attention) */}
                        {newOrders.length > 0 && (
                            <div className="mb-6">
                                <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Zap size={12} /> Needs Your Attention
                                </p>
                                <div className="space-y-3">
                                    {newOrders.slice(0, 3).map(order => (
                                        <div key={order._id} className="bg-amber-50 border-2 border-amber-100 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                                                    <ShoppingBag size={18} />
                                                </div>
                                                <div>
                                                    <p className="font-black text-slate-900 text-sm">{order.customer?.name || 'Customer'}</p>
                                                    <p className="text-[10px] text-slate-500 font-bold">
                                                        {order.items?.length} item{order.items?.length > 1 ? 's' : ''} · ₹{order.totalAmount}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleQuickAction(order._id, 'confirmed')}
                                                    className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-wider hover:scale-105 transition-all shadow-sm"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleQuickAction(order._id, 'cancelled')}
                                                    className="px-4 py-2 bg-white text-rose-500 border border-rose-200 rounded-xl text-[10px] font-black uppercase tracking-wider hover:bg-rose-50 transition-all"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Order List */}
                        <div className="space-y-3 max-h-[400px] overflow-y-auto no-scrollbar">
                            {orders.slice(0, 8).map((order) => (
                                <div key={order._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-100 dark:border-slate-700 group hover:border-primary/20 transition-all">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-xs font-black shadow-sm border border-slate-100">
                                            {order._id?.slice(-2).toUpperCase()}
                                        </div>
                                        <div>
                                            <p className="text-sm font-black text-slate-900 dark:text-white">{order.customer?.name || 'Customer'}</p>
                                            <p className="text-[10px] text-slate-400 font-bold">
                                                {order.items?.length} items · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="text-sm font-black text-primary">₹{order.totalAmount}</span>
                                        <span className={`w-2 h-2 rounded-full ${statusColors[order.status] || 'bg-slate-300'}`} title={statusLabels[order.status]} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        {/* Performance Card */}
                        <div className="bg-gradient-to-br from-primary to-rose-600 p-8 rounded-[2.5rem] text-white relative overflow-hidden group">
                            <TrendingUp size={160} className="absolute -right-8 -bottom-8 text-white/5 group-hover:rotate-6 transition-transform duration-700" strokeWidth={1} />
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-4">
                                    <Activity size={14} />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Performance</span>
                                </div>
                                <h3 className="text-3xl font-black tracking-tighter leading-none mb-2">
                                    {deliveredOrders.length}
                                </h3>
                                <p className="text-xs font-bold text-white/60 uppercase tracking-widest mb-6">
                                    Orders completed this period
                                </p>
                                <Link to="/dashboard/analytics" className="bg-white text-primary px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all inline-flex items-center gap-2 shadow-xl">
                                    <BarChart3 size={14} /> Analytics
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">Quick Actions</h3>
                            <div className="space-y-2">
                                {[
                                    { label: 'Manage Menu', icon: <Utensils size={16} />, path: '/dashboard/menu', color: 'text-orange-500' },
                                    { label: 'View Earnings', icon: <DollarSign size={16} />, path: '/dashboard/earnings', color: 'text-emerald-500' },
                                    { label: 'Rider Activity', icon: <Users size={16} />, path: '/dashboard/riders', color: 'text-violet-500' },
                                    { label: 'Customer Reviews', icon: <Star size={16} />, path: '/dashboard/reviews', color: 'text-yellow-500' },
                                ].map(link => (
                                    <Link
                                        key={link.label}
                                        to={link.path}
                                        className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all group"
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className={link.color}>{link.icon}</span>
                                            <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{link.label}</span>
                                        </div>
                                        <ChevronRight size={14} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Order Status Distribution */}
                        <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] p-6 border border-slate-100 dark:border-slate-700">
                            <h3 className="text-sm font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tight">Order Status</h3>
                            <div className="space-y-3">
                                {Object.entries(statusLabels).map(([key, label]) => {
                                    const count = orders.filter(o => o.status === key).length;
                                    if (count === 0) return null;
                                    const pct = Math.round((count / Math.max(orders.length, 1)) * 100);
                                    return (
                                        <div key={key}>
                                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-1">
                                                <span className="text-slate-500">{label}</span>
                                                <span className="text-slate-900 dark:text-white">{count}</span>
                                            </div>
                                            <div className="h-1.5 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className={`h-full ${statusColors[key]} rounded-full`}
                                                />
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </RestaurantLayout>
    );
};

export default Dashboard;
