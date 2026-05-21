import React, { useState, useEffect } from 'react';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ShoppingBag, Clock, CheckCircle2, Truck, XCircle,
    ChevronRight, Phone, MapPin, User, Utensils,
    AlertCircle, Timer, Zap, Filter, Search, Bell, Package
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import { socket, connectSocket } from '../../utils/socket';

const statusConfig = {
    placed:           { label: 'New Order',    color: 'bg-blue-500',    bg: 'bg-blue-50',    text: 'text-blue-600',    icon: <Bell size={14} /> },
    confirmed:        { label: 'Confirmed',    color: 'bg-indigo-500',  bg: 'bg-indigo-50',  text: 'text-indigo-600',  icon: <CheckCircle2 size={14} /> },
    preparing:        { label: 'Preparing',    color: 'bg-amber-500',   bg: 'bg-amber-50',   text: 'text-amber-600',   icon: <Utensils size={14} /> },
    picked_up:        { label: 'Picked Up',    color: 'bg-orange-500',  bg: 'bg-orange-50',  text: 'text-orange-600',  icon: <Package size={14} /> },
    out_for_delivery: { label: 'On the Way',   color: 'bg-purple-500',  bg: 'bg-purple-50',  text: 'text-purple-600',  icon: <Truck size={14} /> },
    delivered:        { label: 'Delivered',     color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-600', icon: <CheckCircle2 size={14} /> },
    cancelled:        { label: 'Cancelled',    color: 'bg-rose-500',    bg: 'bg-rose-50',    text: 'text-rose-600',    icon: <XCircle size={14} /> },
};

const nextStatus = {
    placed: 'confirmed',
    confirmed: 'preparing',
    preparing: 'picked_up',
    picked_up: 'out_for_delivery',
    out_for_delivery: 'delivered',
};

const nextStatusLabel = {
    placed: 'Accept Order',
    confirmed: 'Start Preparing',
    preparing: 'Ready for Pickup',
    picked_up: 'Out for Delivery',
    out_for_delivery: 'Mark Delivered',
};

const RestaurantOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedOrder, setExpandedOrder] = useState(null);
    const [restaurantId, setRestaurantId] = useState(null);

    const fetchOrders = async () => {
        try {
            const { data: resData } = await api.get('/restaurants/owner/me');
            setRestaurantId(resData._id);
            const { data } = await api.get(`/orders/restaurant/${resData._id}`);
            
            setOrders(prev => {
                // Combine existing and new, then deduplicate by _id
                const combined = [...prev, ...data];
                const map = new Map(combined.map(o => [o._id, o]));
                return Array.from(map.values()).sort((a, b) => 
                    new Date(b.createdAt) - new Date(a.createdAt)
                );
            });
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    // Socket setup runs when restaurantId is available
    useEffect(() => {
        if (!restaurantId) return;

        const s = connectSocket();
        s.emit('join_restaurant', restaurantId);

        const handleNewOrder = (newOrder) => {
            setOrders(prev => {
                const exists = prev.find(o => o._id === newOrder._id);
                if (exists) return prev;
                return [newOrder, ...prev];
            });
            toast.info('🔔 New order received!');
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2533/2533-preview.mp3');
            audio.play().catch(() => {});
        };

        s.on('new_order', handleNewOrder);

        return () => {
            s.off('new_order', handleNewOrder);
        };
    }, [restaurantId]);

    const handleUpdateStatus = async (orderId, status) => {
        try {
            const { data } = await api.put(`/orders/${orderId}/status`, { status });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: data.status } : o));
            toast.success(`Order ${status.replace('_', ' ')}!`);
        } catch (e) { toast.error('Failed to update order'); }
    };

    const handleCancel = async (orderId) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status: 'cancelled' });
            setOrders(prev => prev.map(o => o._id === orderId ? { ...o, status: 'cancelled' } : o));
            toast.success('Order cancelled');
        } catch (e) { toast.error('Cancel failed'); }
    };

    const filters = [
        { id: 'all', label: 'All Orders' },
        { id: 'placed', label: 'New' },
        { id: 'preparing', label: 'Preparing' },
        { id: 'picked_up', label: 'Picked Up' },
        { id: 'delivered', label: 'Delivered' },
        { id: 'cancelled', label: 'Cancelled' },
    ];

    const filteredOrders = orders
        .filter(o => activeFilter === 'all' || o.status === activeFilter)
        .filter(o => {
            if (!searchQuery) return true;
            const q = searchQuery.toLowerCase();
            return o._id?.toLowerCase().includes(q) ||
                   o.customer?.name?.toLowerCase().includes(q) ||
                   o.items?.some(i => i.food?.name?.toLowerCase().includes(q));
        });

    const newOrdersCount = orders.filter(o => o.status === 'placed').length;

    if (loading) return (
        <RestaurantLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Orders...</p>
            </div>
        </RestaurantLayout>
    );

    return (
        <RestaurantLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Order Management</h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">{orders.length} total orders</p>
                    </div>

                    {/* Search */}
                    <div className="relative max-w-xs w-full">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
                        <input
                            type="text"
                            placeholder="Search orders..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white border border-slate-100 rounded-xl pl-11 pr-4 py-3 text-sm font-bold text-slate-900 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary/20 shadow-sm"
                        />
                    </div>
                </div>

                {/* New Orders Alert */}
                {newOrdersCount > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-blue-500/20"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <p className="font-black text-sm">{newOrdersCount} New Order{newOrdersCount > 1 ? 's' : ''} Waiting</p>
                                <p className="text-[10px] font-bold text-white/70">Accept them before they expire</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setActiveFilter('placed')}
                            className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                            View
                        </button>
                    </motion.div>
                )}

                {/* Filter Tabs */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2">
                    {filters.map(f => {
                        const count = f.id === 'all' ? orders.length : orders.filter(o => o.status === f.id).length;
                        return (
                            <button
                                key={f.id}
                                onClick={() => setActiveFilter(f.id)}
                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all whitespace-nowrap flex items-center gap-2 ${
                                    activeFilter === f.id
                                        ? 'bg-slate-900 text-white shadow-md'
                                        : 'bg-white text-slate-400 border border-slate-100 hover:border-slate-200'
                                }`}
                            >
                                {f.label}
                                {count > 0 && (
                                    <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                                        activeFilter === f.id ? 'bg-white/20' : 'bg-slate-100'
                                    }`}>{count}</span>
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Orders Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    <AnimatePresence>
                        {filteredOrders.length === 0 ? (
                            <div className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
                                <ShoppingBag size={40} className="text-slate-200 mx-auto mb-4" />
                                <p className="text-lg font-black text-slate-900 mb-1">No Orders Found</p>
                                <p className="text-sm text-slate-400 font-medium">Try adjusting your filters</p>
                            </div>
                        ) : (
                            filteredOrders.map((order, i) => {
                                const sc = statusConfig[order.status] || statusConfig.placed;
                                const isExpanded = expandedOrder === order._id;
                                const canAdvance = nextStatus[order.status];

                                return (
                                    <motion.div
                                        key={order._id}
                                        layout
                                        initial={{ opacity: 0, y: 15 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ delay: i * 0.03 }}
                                        className={`bg-white rounded-[2rem] border-2 transition-all overflow-hidden ${
                                            order.status === 'placed' ? 'border-blue-200 shadow-lg shadow-blue-100/50' : 'border-slate-100 shadow-sm'
                                        } ${isExpanded ? 'ring-2 ring-primary/10' : ''}`}
                                    >
                                        {/* Order Header */}
                                        <div
                                            className="p-6 cursor-pointer hover:bg-slate-50/50 transition-colors"
                                            onClick={() => setExpandedOrder(isExpanded ? null : order._id)}
                                        >
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 ${sc.bg} rounded-xl flex items-center justify-center ${sc.text}`}>
                                                        {sc.icon}
                                                    </div>
                                                    <div>
                                                        <h4 className="font-black text-slate-900 text-sm">#{order._id?.slice(-6).toUpperCase()}</h4>
                                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                                            {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${sc.bg} ${sc.text}`}>
                                                        <span className={`w-1.5 h-1.5 rounded-full ${sc.color} ${order.status === 'placed' ? 'animate-pulse' : ''}`} />
                                                        {sc.label}
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Customer & Amount */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <User size={14} className="text-slate-300" />
                                                    <span className="text-sm font-bold text-slate-700">{order.customer?.name || 'Customer'}</span>
                                                </div>
                                                <span className="text-lg font-black text-slate-900">₹{order.totalAmount}</span>
                                            </div>

                                            {/* Items Preview */}
                                            <div className="flex flex-wrap gap-1.5 mt-3">
                                                {order.items?.slice(0, 3).map((item, idx) => (
                                                    <span key={idx} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-2.5 py-1 rounded-lg">
                                                        {item.quantity}x {item.food?.name || 'Item'}
                                                    </span>
                                                ))}
                                                {order.items?.length > 3 && (
                                                    <span className="text-[10px] font-bold text-slate-400">+{order.items.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>

                                        {/* Expanded Details */}
                                        <AnimatePresence>
                                            {isExpanded && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="px-6 pb-6 pt-0 border-t border-slate-100">
                                                        {/* Full Items List */}
                                                        <div className="py-4 space-y-2">
                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Order Items</p>
                                                            {order.items?.map((item, idx) => (
                                                                <div key={idx} className="flex items-center justify-between py-2">
                                                                    <div className="flex items-center gap-3">
                                                                        <span className="w-7 h-7 bg-primary/10 text-primary text-[10px] font-black rounded-lg flex items-center justify-center">
                                                                            {item.quantity}x
                                                                        </span>
                                                                        <span className="text-sm font-medium text-slate-700">{item.food?.name || 'Item'}</span>
                                                                    </div>
                                                                    <span className="text-sm font-black text-slate-900">₹{(item.price || 0) * item.quantity}</span>
                                                                </div>
                                                            ))}
                                                        </div>

                                                        {/* Delivery Address */}
                                                        {order.deliveryAddress && (
                                                            <div className="flex items-start gap-3 py-3 border-t border-slate-50">
                                                                <MapPin size={14} className="text-slate-300 mt-0.5 shrink-0" />
                                                                <p className="text-xs font-medium text-slate-500">{order.deliveryAddress}</p>
                                                            </div>
                                                        )}

                                                        {/* Action Buttons */}
                                                        <div className="flex gap-3 mt-4">
                                                            {canAdvance && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleUpdateStatus(order._id, canAdvance); }}
                                                                    className={`flex-1 py-3.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-lg flex items-center justify-center gap-2 ${
                                                                        order.status === 'placed'
                                                                            ? 'bg-emerald-500 text-white shadow-emerald-500/20 hover:scale-[1.02]'
                                                                            : 'bg-primary text-white shadow-primary/20 hover:scale-[1.02]'
                                                                    }`}
                                                                >
                                                                    <CheckCircle2 size={14} />
                                                                    {nextStatusLabel[order.status]}
                                                                </button>
                                                            )}
                                                            {order.status === 'placed' && (
                                                                <button
                                                                    onClick={(e) => { e.stopPropagation(); handleCancel(order._id); }}
                                                                    className="px-5 py-3.5 bg-white border border-rose-200 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-rose-50 transition-all"
                                                                >
                                                                    Reject
                                                                </button>
                                                            )}
                                                            {order.customer?.phone && (
                                                                <a
                                                                    href={`tel:${order.customer.phone}`}
                                                                    className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary/20 transition-all shrink-0"
                                                                >
                                                                    <Phone size={16} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                );
                            })
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </RestaurantLayout>
    );
};

export default RestaurantOrders;
