import React, { useState, useEffect } from 'react';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { motion } from 'framer-motion';
import {
    DollarSign, TrendingUp, Calendar, ArrowUpRight, ArrowDownRight,
    CreditCard, ChevronLeft, ChevronRight, ShoppingBag, Users,
    Download, Filter, Eye
} from 'lucide-react';
import api from '../../utils/api';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const weekData = [
    { day: 'Mon', amount: 2450 },
    { day: 'Tue', amount: 3200 },
    { day: 'Wed', amount: 1800 },
    { day: 'Thu', amount: 4100 },
    { day: 'Fri', amount: 3650 },
    { day: 'Sat', amount: 5200 },
    { day: 'Sun', amount: 2900 },
];
const maxAmount = Math.max(...weekData.map(d => d.amount));

const RestaurantEarnings = () => {
    const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
    const [orders, setOrders] = useState([]);
    const [analytics, setAnalytics] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeRange, setActiveRange] = useState('week');

    useEffect(() => {
        const load = async () => {
            try {
                const [resData, analyticsRes] = await Promise.all([
                    api.get('/restaurants/owner/me'),
                    api.get('/restaurants/analytics')
                ]);
                setRestaurant(resData.data);
                setAnalytics(analyticsRes.data);
                
                const { data: ordersData } = await api.get(`/orders/restaurant/${resData.data._id}`);
                setOrders(ordersData);
            } catch (e) { 
                console.error(e); 
            } finally { 
                setLoading(false); 
            }
        };
        load();
    }, []);

    const weekData = analytics?.weeklyOrders || [];
    const maxAmount = Math.max(...weekData.map(d => d.orders * 250), 1000); // Estimating amount for chart
    const delivered = orders.filter(o => o.status === 'delivered');
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const todayRevenue = todayOrders.filter(o => o.status === 'delivered').reduce((s, o) => s + o.totalAmount, 0);
    const totalRevenue = analytics?.stats?.totalRevenue || 0;
    const weeklyRevenue = weekData.reduce((s, d) => s + (d.orders * 250), 0); // Estimating
    const avgOrderValue = delivered.length > 0 ? Math.round(totalRevenue / delivered.length) : 0;

    if (loading) return (
        <RestaurantLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </RestaurantLayout>
    );

    return (
        <RestaurantLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings & Revenue</h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">Financial overview for {restaurant?.name}</p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-slate-300 transition-all">
                            <Filter size={14} /> Filter
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
                            <Download size={14} /> Export
                        </button>
                    </div>
                </div>

                {/* Revenue Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: "Today's Revenue", value: `₹${(todayRevenue || 0).toLocaleString()}`, change: '+18%', up: true, gradient: 'from-emerald-500 to-teal-500', icon: <DollarSign size={20} /> },
                        { label: 'This Week', value: `₹${weeklyRevenue.toLocaleString()}`, change: '+12%', up: true, gradient: 'from-violet-500 to-purple-500', icon: <Calendar size={20} /> },
                        { label: 'Total Revenue', value: `₹${(totalRevenue || 0).toLocaleString()}`, change: '+24%', up: true, gradient: 'from-amber-500 to-orange-500', icon: <TrendingUp size={20} /> },
                        { label: 'Avg Order Value', value: `₹${avgOrderValue}`, change: '+5%', up: true, gradient: 'from-sky-500 to-blue-500', icon: <CreditCard size={20} /> },
                    ].map((card, i) => (
                        <motion.div
                            key={card.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className={`bg-gradient-to-br ${card.gradient} rounded-[2rem] p-6 text-white relative overflow-hidden`}
                        >
                            <div className="absolute -top-8 -right-8 w-24 h-24 bg-white/5 rounded-full blur-xl" />
                            <div className="relative z-10">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                                        {card.icon}
                                    </div>
                                    <div className={`flex items-center gap-0.5 text-[10px] font-black text-white/80`}>
                                        {card.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                        {card.change}
                                    </div>
                                </div>
                                <p className="text-[9px] font-black text-white/60 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-2xl font-black tracking-tighter leading-none">{card.value}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Revenue Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Revenue Trend</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Daily revenue breakdown</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {['week', 'month', 'year'].map(range => (
                                <button
                                    key={range}
                                    onClick={() => setActiveRange(range)}
                                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                        activeRange === range ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-400'
                                    }`}
                                >
                                    {range}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="flex items-end gap-4 h-56">
                        {weekData.map((d, i) => {
                            const height = (d.amount / maxAmount) * 100;
                            const isToday = i === new Date().getDay() - 1;
                            return (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-[9px] font-black text-slate-400">{d.orders} Ord</span>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${(d.orders / (Math.max(...weekData.map(w => w.orders), 1))) * 100}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.08 }}
                                        className={`w-full rounded-xl transition-all cursor-pointer hover:opacity-80 ${
                                            isToday
                                                ? 'bg-gradient-to-t from-primary to-rose-400 shadow-lg shadow-primary/20'
                                                : 'bg-gradient-to-t from-slate-100 to-slate-50'
                                        }`}
                                    />
                                    <span className={`text-[10px] font-black uppercase ${isToday ? 'text-primary' : 'text-slate-400'}`}>
                                        {d.day}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Recent Transactions */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-primary rounded-full" />
                            Recent Transactions
                        </h3>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {delivered.length === 0 ? (
                            <div className="py-20 text-center text-slate-400 font-black uppercase text-[10px] tracking-widest">
                                No Transactions Found
                            </div>
                        ) : delivered.slice(0, 10).map((order, i) => (
                            <motion.div
                                key={order._id || i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                        <ShoppingBag size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">{order.customer?.name || 'Customer'}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                            {order.items?.length || 1} items · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-black text-emerald-500">+₹{order.totalAmount}</p>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">Completed</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </RestaurantLayout>
    );
};

export default RestaurantEarnings;
