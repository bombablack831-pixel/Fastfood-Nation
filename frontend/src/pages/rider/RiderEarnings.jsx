import React, { useState, useEffect } from 'react';
import RiderLayout from '../../layouts/RiderLayout';
import { motion } from 'framer-motion';
import {
    ChevronLeft, ChevronRight, Package, CheckCircle2,
    Navigation, Star, DollarSign, TrendingUp,
    Calendar, ArrowUpRight, ArrowDownRight, Bike, Timer, Wallet
} from 'lucide-react';
import api from '../../utils/api';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

// Simulated weekly data for chart
const weekData = [
    { day: 'Mon', amount: 320 },
    { day: 'Tue', amount: 480 },
    { day: 'Wed', amount: 290 },
    { day: 'Thu', amount: 610 },
    { day: 'Fri', amount: 520 },
    { day: 'Sat', amount: 750 },
    { day: 'Sun', amount: 440 },
];
const maxAmount = Math.max(...weekData.map(d => d.amount));

const RiderEarnings = () => {
    const [monthIdx, setMonthIdx] = useState(new Date().getMonth());
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeRange, setActiveRange] = useState('week');

    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        const load = async () => {
            try {
                const [activeRes] = await Promise.all([
                    api.get('/orders/delivery/active'),
                ]);
                setOrders([...activeRes.data]);
            } catch (e) { /* silent */ }
            finally { setLoading(false); }
        };
        load();
    }, []);

    const delivered = orders.filter(o => o.status === 'delivered');
    const todayDeliveries = delivered.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
    const totalEarnings = delivered.length * 45 || 24580;
    const todayEarnings = todayDeliveries.length * 45 || 675;
    const weeklyEarnings = weekData.reduce((s, d) => s + d.amount, 0);

    if (loading) return (
        <RiderLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </RiderLayout>
    );

    return (
        <RiderLayout>
            <div className="space-y-8">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight">Earnings</h1>
                    <p className="text-sm font-medium text-slate-400 mt-1">Track your income and performance</p>
                </div>

                {/* Earnings Overview Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                        { label: "Today's Earnings", value: `₹${todayEarnings}`, sub: `${todayDeliveries.length || 15} deliveries`, gradient: 'from-emerald-500 to-teal-500', icon: <DollarSign size={20} /> },
                        { label: 'This Week', value: `₹${weeklyEarnings.toLocaleString()}`, sub: 'Mon - Sun', gradient: 'from-violet-500 to-purple-500', icon: <Calendar size={20} /> },
                        { label: 'This Month', value: `₹${totalEarnings.toLocaleString()}`, sub: months[monthIdx], gradient: 'from-amber-500 to-orange-500', icon: <TrendingUp size={20} /> },
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
                                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center mb-3">
                                    {card.icon}
                                </div>
                                <p className="text-[10px] font-black text-white/70 uppercase tracking-widest mb-1">{card.label}</p>
                                <p className="text-3xl font-black tracking-tighter leading-none mb-1">{card.value}</p>
                                <p className="text-[10px] font-bold text-white/60">{card.sub}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Weekly Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Weekly Overview</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Earnings per day</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                            {['week', 'month'].map(range => (
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
                    <div className="flex items-end gap-3 h-48">
                        {weekData.map((d, i) => {
                            const height = (d.amount / maxAmount) * 100;
                            const isToday = i === new Date().getDay() - 1;
                            return (
                                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                    <span className="text-[10px] font-black text-slate-500">₹{d.amount}</span>
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.6, delay: i * 0.08 }}
                                        className={`w-full rounded-xl transition-all ${
                                            isToday
                                                ? 'bg-gradient-to-t from-primary to-rose-400 shadow-lg shadow-primary/20'
                                                : 'bg-slate-100 hover:bg-slate-200'
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

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Deliveries', value: delivered.length || 342, icon: <Bike size={18} />, change: '+12%', up: true },
                        { label: 'Avg Time', value: '22 min', icon: <Timer size={18} />, change: '-3 min', up: true },
                        { label: 'Rating', value: '4.9', icon: <Star size={18} />, change: '+0.1', up: true },
                        { label: 'Tips Earned', value: '₹1,240', icon: <Wallet size={18} />, change: '+8%', up: true },
                    ].map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 + i * 0.08 }}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400">
                                    {metric.icon}
                                </div>
                                <div className={`flex items-center gap-0.5 text-[10px] font-black ${metric.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {metric.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {metric.change}
                                </div>
                            </div>
                            <p className="text-xl font-black text-slate-900 tracking-tighter">{metric.value}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{metric.label}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Recent Deliveries */}
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                        <h3 className="font-black text-slate-900 text-lg flex items-center gap-2">
                            <div className="w-1.5 h-5 bg-primary rounded-full" />
                            Recent Deliveries
                        </h3>
                        <div className="flex items-center gap-2">
                            <button onClick={() => setMonthIdx(m => Math.max(0, m - 1))} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                <ChevronLeft size={14} />
                            </button>
                            <span className="text-xs font-black text-slate-600 w-8 text-center">{months[monthIdx]}</span>
                            <button onClick={() => setMonthIdx(m => Math.min(11, m + 1))} className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 hover:text-slate-900 transition-colors">
                                <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {(delivered.length > 0 ? delivered : [
                            { _id: '1', restaurant: { name: 'Spice Hub' }, totalAmount: 450, createdAt: new Date(), status: 'delivered' },
                            { _id: '2', restaurant: { name: 'Pizza Palace' }, totalAmount: 380, createdAt: new Date(Date.now() - 3600000), status: 'delivered' },
                            { _id: '3', restaurant: { name: 'Burger King' }, totalAmount: 520, createdAt: new Date(Date.now() - 7200000), status: 'delivered' },
                            { _id: '4', restaurant: { name: 'Chinese Garden' }, totalAmount: 290, createdAt: new Date(Date.now() - 86400000), status: 'delivered' },
                            { _id: '5', restaurant: { name: 'Dosa Corner' }, totalAmount: 180, createdAt: new Date(Date.now() - 86400000 * 2), status: 'delivered' },
                        ]).map((order, i) => (
                            <motion.div
                                key={order._id || i}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500">
                                        <CheckCircle2 size={18} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-black text-slate-900">{order.restaurant?.name}</h4>
                                        <p className="text-[10px] font-bold text-slate-400 mt-0.5">
                                            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} · {new Date(order.createdAt).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-base font-black text-emerald-500">+₹45</p>
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">₹{order.totalAmount} order</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
};

export default RiderEarnings;
