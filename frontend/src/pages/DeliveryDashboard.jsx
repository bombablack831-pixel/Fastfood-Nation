import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';
import {
    Truck, CheckCircle2, MapPin, Phone,
    Navigation, Package, Clock,
    Zap, History, Activity,
    Box, ChevronRight, Bike, Store, Bell, Star,
    Power, DollarSign, Route, TrendingUp,
    Shield, Timer, ArrowRight, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import RiderLayout from '../layouts/RiderLayout';
import { io } from 'socket.io-client';
import LiveMap from '../components/LiveMap';
import { Link } from 'react-router-dom';
import getLocation from '../utils/getLocation';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;
const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });

const DeliveryDashboard = () => {
    const [activeTab, setActiveTab] = useState('active');
    const [orders, setOrders] = useState([]);
    const [availableOrders, setAvailableOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isOnline, setIsOnline] = useState(true);
    const [newDeliveryAlert, setNewDeliveryAlert] = useState(false);
    const geoPermissionDenied = useRef(false);
    const watchIdRef = useRef(null);

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    const fetchData = async () => {
        try {
            // Smart location: GPS → IP → Kanodar (no repeated permission popups)
            const loc = await getLocation();
            const lat = loc.lat;
            const lng = loc.lng;

            const [activeRes, availableRes] = await Promise.all([
                api.get('/orders/delivery/active'),
                api.get(`/orders/delivery/available${lat ? `?lat=${lat}&lng=${lng}` : ''}`)
            ]);
            setOrders(activeRes.data);
            setAvailableOrders(availableRes.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        socket.emit('join_riders');
        socket.on('order_available', (newOrder) => {
            setAvailableOrders(prev => {
                if (prev.some(o => o._id === newOrder._id)) return prev;
                return [newOrder, ...prev];
            });
            setNewDeliveryAlert(true);
            toast.info('🏍️ New Delivery Available!', { position: 'top-center' });
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3');
            audio.play().catch(e => {
                console.log('Audio alert skipped');
            });
            setTimeout(() => setNewDeliveryAlert(false), 6000);
        });
        const interval = setInterval(fetchData, 60000);
        return () => {
            clearInterval(interval);
            socket.off('order_available');
        };
    }, []);

    useEffect(() => {
        if (!isOnline) return;
        const activeOrders = orders.filter(o => ['picked_up', 'out_for_delivery'].includes(o.status));
        if (activeOrders.length === 0) return;
        if (geoPermissionDenied.current || !navigator.geolocation) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (position) => {
                const { latitude, longitude, heading } = position.coords;
                activeOrders.forEach(order => {
                    socket.emit('update_location', {
                        orderId: order._id,
                        location: { lat: latitude, lng: longitude },
                        heading: heading || 0
                    });
                });
            },
            (error) => {
                if (error.code === 1) {
                    geoPermissionDenied.current = true;
                    if (watchIdRef.current !== null) {
                        navigator.geolocation.clearWatch(watchIdRef.current);
                        watchIdRef.current = null;
                    }
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );
        return () => {
            if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current);
        };
    }, [orders, isOnline]);

    useEffect(() => {
        orders.forEach(order => {
            if (['picked_up', 'out_for_delivery'].includes(order.status)) {
                socket.emit('join_order', order._id);
            }
        });
    }, [orders]);

    const handleAcceptOrder = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/status`, {
                deliveryBoy: userInfo._id,
                status: 'picked_up'
            });
            toast.success('🏍️ Delivery Accepted!');
            fetchData();
        } catch (err) { toast.error('Acceptance failed'); }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            toast.success(`✅ ${status.replace('_', ' ').toUpperCase()}`);
            fetchData();
        } catch (err) { toast.error('Update failed'); }
    };

    if (loading) return (
        <RiderLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full" />
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Loading Fleet Status...</p>
            </div>
        </RiderLayout>
    );

    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const historyOrders = orders.filter(o => o.status === 'delivered');
    const todayHistory = historyOrders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const dailyEarnings = todayHistory.reduce((acc, o) => acc + (o.deliveryFee || 40), 0);
    const weeklyEarnings = historyOrders.filter(o => {
        const d = new Date(o.createdAt);
        return (new Date() - d) < 7 * 24 * 60 * 60 * 1000;
    }).reduce((acc, o) => acc + (o.deliveryFee || 40), 0);

    return (
        <RiderLayout>
            <div className="space-y-8 pb-32">
                {/* New Delivery Alert */}
                <AnimatePresence>
                    {newDeliveryAlert && (
                        <motion.div
                            initial={{ opacity: 0, y: -20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl p-4 flex items-center justify-between text-white shadow-xl shadow-emerald-500/20"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center animate-bounce">
                                    <Bike size={20} />
                                </div>
                                <div>
                                    <p className="font-black text-sm">New Delivery Available!</p>
                                    <p className="text-[10px] font-bold text-white/80">Accept it before someone else does</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setActiveTab('available')}
                                className="bg-white/20 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/30 transition-all"
                            >
                                View →
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Status Bar + Online Toggle */}
                <div className="bg-white rounded-[2.5rem] p-8 lg:p-10 border border-slate-100 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-20 -mt-20" />

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 relative z-10">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-amber-500" />
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fleet Command</span>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-3">
                                Hi, {userInfo?.name?.split(' ')[0]}! <span className="text-primary">🏍️</span>
                            </h1>

                            {/* Online Toggle */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => setIsOnline(!isOnline)}
                                    className={`relative w-16 h-9 rounded-full p-1 transition-all duration-500 ${isOnline ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-slate-300'}`}
                                >
                                    <motion.div
                                        animate={{ x: isOnline ? 28 : 0 }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                                        className="w-7 h-7 bg-white rounded-full shadow-md flex items-center justify-center"
                                    >
                                        <Power size={12} className={isOnline ? 'text-emerald-500' : 'text-slate-400'} />
                                    </motion.div>
                                </button>
                                <div>
                                    <p className={`text-sm font-black ${isOnline ? 'text-emerald-600' : 'text-slate-400'}`}>
                                        {isOnline ? 'Online' : 'Offline'}
                                    </p>
                                    <p className="text-[10px] font-bold text-slate-400">
                                        {isOnline ? 'Ready to accept deliveries' : 'You won\'t receive new orders'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full md:w-auto">
                            {[
                                { label: "Today's Earnings", value: `₹${dailyEarnings}`, icon: <DollarSign className="text-emerald-500" size={14} />, gradient: 'from-emerald-50 to-teal-50', border: 'border-emerald-100' },
                                { label: 'Deliveries', value: todayHistory.length, icon: <Route className="text-primary" size={14} />, gradient: 'from-orange-50 to-rose-50', border: 'border-orange-100' },
                                { label: 'Active', value: activeOrders.length, icon: <Zap className="text-amber-500" size={14} />, gradient: 'from-amber-50 to-yellow-50', border: 'border-amber-100' },
                            ].map((s, i) => (
                                <div key={i} className={`bg-gradient-to-br ${s.gradient} p-5 rounded-[1.5rem] border ${s.border} shadow-sm flex flex-col justify-center min-w-[120px]`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        {s.icon}
                                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                                    </div>
                                    <p className="text-xl font-black text-slate-900 tracking-tighter leading-none">{s.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex items-center gap-2 bg-white p-1.5 rounded-[1.5rem] border border-slate-100 shadow-sm w-fit">
                    {[
                        { id: 'active', label: 'In Progress', count: activeOrders.length, icon: <Navigation size={14} /> },
                        { id: 'available', label: 'Available', count: availableOrders.length, icon: <Package size={14} /> },
                        { id: 'history', label: 'History', count: todayHistory.length, icon: <History size={14} /> },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                                activeTab === tab.id
                                ? 'bg-slate-900 text-white shadow-lg'
                                : 'text-slate-400 hover:text-slate-900 hover:bg-slate-50'
                            }`}
                        >
                            {tab.icon}
                            {tab.label}
                            {tab.count > 0 && (
                                <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                                    activeTab === tab.id ? 'bg-white/20' : 'bg-primary text-white'
                                }`}>{tab.count}</span>
                            )}
                        </button>
                    ))}
                </div>

                <AnimatePresence mode="wait">
                    {/* ACTIVE TAB */}
                    {activeTab === 'active' && (
                        <motion.div key="active" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} className="space-y-6">
                            {activeOrders.length === 0 ? (
                                <div className="py-24 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Navigation className="text-slate-200" size={36} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1">No Active Deliveries</h3>
                                    <p className="text-sm text-slate-400 font-medium mb-6">Check the available tab for new orders</p>
                                    <button
                                        onClick={() => setActiveTab('available')}
                                        className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20"
                                    >
                                        View Available <ArrowRight size={14} />
                                    </button>
                                </div>
                            ) : (
                                activeOrders.map(order => (
                                    <div key={order._id} className="bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/40 relative overflow-hidden">
                                        {/* Order Header */}
                                        <div className="p-8 pb-0">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="flex items-center gap-3">
                                                    <span className="px-4 py-1.5 bg-gradient-to-r from-primary to-rose-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                                                        Active
                                                    </span>
                                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                                        ID #{order._id.slice(-8).toUpperCase()}
                                                    </span>
                                                </div>
                                                <span className="text-2xl font-black text-primary">₹{order.totalAmount}</span>
                                            </div>

                                            {/* Pickup & Drop */}
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 shrink-0">
                                                        <Store size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest mb-1">Pickup</p>
                                                        <h4 className="font-black text-slate-900 leading-tight">{order.restaurant?.name}</h4>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-1">{order.restaurant?.address}</p>
                                                    </div>
                                                </div>
                                                <div className="flex gap-4">
                                                    <div className="w-10 h-10 bg-violet-50 rounded-xl flex items-center justify-center text-violet-500 shrink-0">
                                                        <MapPin size={20} />
                                                    </div>
                                                    <div>
                                                        <p className="text-[9px] font-black text-violet-500 uppercase tracking-widest mb-1">Drop-off</p>
                                                        <h4 className="font-black text-slate-900 leading-tight">{order.customer?.name}</h4>
                                                        <p className="text-[10px] font-medium text-slate-400 mt-0.5 line-clamp-1">{order.deliveryAddress}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Items List */}
                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {order.items?.map((item, idx) => (
                                                    <span key={idx} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                                        {item.quantity}x {item.food?.name}
                                                    </span>
                                                ))}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex gap-3 mb-6">
                                                <button 
                                                    onClick={() => {
                                                        const lat = order.deliveryLocation?.lat;
                                                        const lng = order.deliveryLocation?.lng;
                                                        if (lat && lng) {
                                                            window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                                                        } else {
                                                            toast.error('Coordinates not available for navigation');
                                                        }
                                                    }}
                                                    className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-900 border border-slate-800 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:bg-primary transition-all"
                                                >
                                                    <Route size={14} className="text-primary" /> Navigate
                                                </button>
                                                <button className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-primary/20 transition-all">
                                                    <Phone size={14} /> Call Customer
                                                </button>
                                                {order.status === 'picked_up' ? (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'delivered')}
                                                        className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 py-3.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <CheckCircle2 size={14} /> Mark Delivered
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleUpdateStatus(order._id, 'picked_up')}
                                                        className="flex-1 bg-gradient-to-r from-primary to-rose-500 py-3.5 rounded-xl text-[10px] font-black text-white uppercase tracking-widest shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Package size={14} /> Confirm Pickup
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Live Map */}
                                        <div className="h-64 lg:h-80 w-full border-t border-slate-100 relative">
                                            <LiveMap
                                                riderLocation={null}
                                                restaurantLocation={
                                                    order.restaurant?.location?.coordinates ?
                                                    { lng: order.restaurant.location.coordinates[0], lat: order.restaurant.location.coordinates[1] }
                                                    : null
                                                }
                                                customerLocation={
                                                    order.deliveryLocation?.lat ? order.deliveryLocation : null
                                                }
                                                restaurantName={order.restaurant?.name}
                                                customerName={order.customer?.name}
                                                zoom={13}
                                            />
                                        </div>
                                    </div>
                                ))
                            )}
                        </motion.div>
                    )}

                    {/* AVAILABLE TAB */}
                    {activeTab === 'available' && (
                        <motion.div key="available" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
                            {!isOnline ? (
                                <div className="py-24 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                                    <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Power className="text-rose-300" size={36} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1">You're Offline</h3>
                                    <p className="text-sm text-slate-400 font-medium mb-6">Go online to start receiving delivery requests</p>
                                    <button
                                        onClick={() => setIsOnline(true)}
                                        className="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-emerald-500/20"
                                    >
                                        <Power size={14} /> Go Online
                                    </button>
                                </div>
                            ) : availableOrders.length === 0 ? (
                                <div className="py-24 text-center bg-white border border-slate-100 rounded-[2.5rem] shadow-sm">
                                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Package className="text-slate-200" size={36} />
                                    </div>
                                    <h3 className="text-lg font-black text-slate-900 mb-1">No Orders Available</h3>
                                    <p className="text-sm text-slate-400 font-medium">New deliveries will appear here automatically</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                    {availableOrders.map((order, i) => (
                                        <motion.div
                                            key={order._id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary/10 transition-all group"
                                        >
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-orange-100 rounded-xl flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                                        <Package size={24} />
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 leading-tight">{order.restaurant?.name || 'Restaurant'}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 flex items-center gap-1 mt-0.5">
                                                            <MapPin size={10} /> {order.restaurant?.address?.split(',')[0] || 'Location'}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Earn</p>
                                                    <p className="text-xl font-black text-emerald-500 tracking-tighter">₹45</p>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4 mb-4 text-[10px] font-bold text-slate-400">
                                                <span className="flex items-center gap-1"><Timer size={12} /> ~25 min</span>
                                                <span className="flex items-center gap-1"><Route size={12} /> ~3.2 km</span>
                                                <span className="flex items-center gap-1"><Package size={12} /> {order.items?.length || 1} items</span>
                                            </div>

                                            <button
                                                onClick={() => handleAcceptOrder(order._id)}
                                                className="w-full bg-gradient-to-r from-slate-900 to-slate-800 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:from-primary hover:to-rose-500 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Bike size={14} /> Accept Delivery
                                            </button>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}

                    {/* HISTORY TAB */}
                    {activeTab === 'history' && (
                        <motion.div key="history" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="space-y-6">
                            {/* Earnings Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {[
                                    { label: "Today's Earnings", value: `₹${dailyEarnings}`, sub: `${todayHistory.length} deliveries`, gradient: 'from-emerald-500 to-teal-500' },
                                    { label: 'This Week', value: `₹${weeklyEarnings}`, sub: `${historyOrders.length} total`, gradient: 'from-violet-500 to-purple-500' },
                                    { label: 'Avg per Order', value: '₹45', sub: 'Base + incentive', gradient: 'from-amber-500 to-orange-500' },
                                ].map((card, i) => (
                                    <div key={i} className={`bg-gradient-to-br ${card.gradient} rounded-[2rem] p-6 text-white relative overflow-hidden`}>
                                        <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                                        <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-2">{card.label}</p>
                                        <p className="text-3xl font-black tracking-tighter leading-none mb-1">{card.value}</p>
                                        <p className="text-[10px] font-bold text-white/60">{card.sub}</p>
                                    </div>
                                ))}
                            </div>

                            {/* History List */}
                            <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                                <div className="p-6 pb-4 border-b border-slate-100">
                                    <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                                        <div className="w-1.5 h-5 bg-primary rounded-full" />
                                        Delivery History
                                    </h3>
                                </div>
                                <div className="divide-y divide-slate-50">
                                    {historyOrders.length === 0 ? (
                                        <div className="p-16 text-center">
                                            <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">No deliveries completed yet</p>
                                        </div>
                                    ) : (
                                        historyOrders.map(order => (
                                            <div key={order._id} className="p-5 flex justify-between items-center hover:bg-slate-50/50 transition-colors">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                                        <CheckCircle2 size={20} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-sm font-black text-slate-900">{order.restaurant?.name}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-lg font-black text-emerald-500 tracking-tighter">+₹45</p>
                                                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">Completed</span>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>

                            {/* View Full Earnings */}
                            <Link
                                to="/delivery/earnings"
                                className="block bg-slate-900 text-white rounded-[2rem] p-6 text-center hover:bg-primary transition-all group"
                            >
                                <p className="font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                                    <TrendingUp size={16} /> View Full Earnings Report <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                                </p>
                            </Link>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </RiderLayout>
    );
};

export default DeliveryDashboard;
