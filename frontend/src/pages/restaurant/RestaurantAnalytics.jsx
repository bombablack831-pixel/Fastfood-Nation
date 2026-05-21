import React, { useState, useEffect } from 'react';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Users, ShoppingBag, Star,
    ArrowUpRight, ArrowDownRight, Clock, DollarSign,
    Eye, Utensils, Percent, Target, Award, CheckCircle
} from 'lucide-react';
import api from '../../utils/api';

const weeklyOrders = [
    { day: 'Mon', orders: 24 }, { day: 'Tue', orders: 32 },
    { day: 'Wed', orders: 18 }, { day: 'Thu', orders: 41 },
    { day: 'Fri', orders: 36 }, { day: 'Sat', orders: 52 },
    { day: 'Sun', orders: 29 },
];
const maxOrders = Math.max(...weeklyOrders.map(d => d.orders));

const topItems = [
    { name: 'Butter Chicken', orders: 156, revenue: '₹46,800', pct: 100 },
    { name: 'Chicken Biryani', orders: 128, revenue: '₹35,840', pct: 82 },
    { name: 'Paneer Tikka', orders: 97, revenue: '₹19,400', pct: 62 },
    { name: 'Margherita Pizza', orders: 84, revenue: '₹20,916', pct: 54 },
    { name: 'Masala Dosa', orders: 71, revenue: '₹9,230', pct: 45 },
];

const RestaurantAnalytics = () => {
    const [period, setPeriod] = useState('week');
    const [analytics, setAnalytics] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const [resData, analyticsRes] = await Promise.all([
                    api.get('/restaurants/owner/me'),
                    api.get('/restaurants/analytics')
                ]);
                setRestaurant(resData.data);
                setAnalytics(analyticsRes.data);
            } catch (e) { 
                console.error(e); 
            } finally { 
                setLoading(false); 
            }
        };
        load();
    }, []);

    const stats = analytics?.stats || {};
    const weeklyOrders = analytics?.weeklyOrders || [];
    const topItems = analytics?.topItems || [];
    const maxOrders = Math.max(...weeklyOrders.map(d => d.orders), 1);
    const avgRating = restaurant?.rating?.toFixed(1) || '4.8';

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
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Analytics Dashboard</h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">Insights for {restaurant?.name}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
                        {['today', 'week', 'month', 'year'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    period === p ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Total Orders', value: stats.totalOrders || 0, change: '+18%', up: true, icon: <ShoppingBag size={18} />, color: 'text-blue-500', bg: 'bg-blue-50' },
                        { label: 'Revenue', value: `₹${(stats.totalRevenue || 0).toLocaleString()}`, change: '+24%', up: true, icon: <DollarSign size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                        { label: 'Avg Rating', value: avgRating, change: '+0.2', up: true, icon: <Star size={18} />, color: 'text-yellow-500', bg: 'bg-yellow-50' },
                        { label: 'Delivered', value: stats.deliveredCount || 0, change: '+5%', up: true, icon: <CheckCircle size={18} />, color: 'text-violet-500', bg: 'bg-violet-50' },
                    ].map((kpi, i) => (
                        <motion.div
                            key={kpi.label}
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center ${kpi.color}`}>
                                    {kpi.icon}
                                </div>
                                <span className={`flex items-center gap-0.5 text-[10px] font-black ${kpi.up ? 'text-emerald-500' : 'text-rose-500'}`}>
                                    {kpi.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                    {kpi.change}
                                </span>
                            </div>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">{kpi.label}</p>
                        </motion.div>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Orders Chart */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Order Volume</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Weekly trend</p>
                            </div>
                            <div className="bg-emerald-50 text-emerald-500 text-[10px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1">
                                <TrendingUp size={12} /> +18%
                            </div>
                        </div>

                        <div className="flex items-end gap-3 h-44">
                            {weeklyOrders.map((d, i) => {
                                const height = (d.orders / maxOrders) * 100;
                                const isMax = d.orders === maxOrders;
                                return (
                                    <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                                        <span className="text-[10px] font-black text-slate-400">{d.orders}</span>
                                        <motion.div
                                            initial={{ height: 0 }}
                                            animate={{ height: `${height}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.08 }}
                                            className={`w-full rounded-xl ${
                                                isMax ? 'bg-gradient-to-t from-primary to-rose-400 shadow-md shadow-primary/10' : 'bg-slate-100'
                                            }`}
                                        />
                                        <span className={`text-[10px] font-black uppercase ${isMax ? 'text-primary' : 'text-slate-400'}`}>
                                            {d.day}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Top Selling Items */}
                    <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-lg font-black text-slate-900">Top Selling Items</h3>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">By order count</p>
                            </div>
                            <Utensils size={16} className="text-slate-300" />
                        </div>

                        <div className="space-y-4">
                            {topItems.map((item, i) => (
                                <motion.div
                                    key={item.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.3 + i * 0.08 }}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-3">
                                            <span className="w-6 h-6 bg-slate-100 rounded-lg flex items-center justify-center text-[10px] font-black text-slate-500">
                                                {i + 1}
                                            </span>
                                            <span className="text-sm font-bold text-slate-800">{item.name}</span>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xs font-black text-slate-900">{item.orders}</span>
                                            <span className="text-[10px] font-bold text-slate-400 ml-2">{item.revenue}</span>
                                        </div>
                                    </div>
                                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${item.pct}%` }}
                                            transition={{ duration: 0.6, delay: 0.4 + i * 0.1 }}
                                            className={`h-full rounded-full ${
                                                i === 0 ? 'bg-gradient-to-r from-primary to-rose-400'
                                                : i === 1 ? 'bg-gradient-to-r from-amber-400 to-orange-400'
                                                : 'bg-slate-300'
                                            }`}
                                        />
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Performance Metrics */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    {[
                        { label: 'Avg Prep Time', value: '18 min', icon: <Clock size={20} />, gradient: 'from-sky-500 to-blue-500', sub: '-2 min vs last week' },
                        { label: 'Order Acceptance', value: '96%', icon: <Target size={20} />, gradient: 'from-emerald-500 to-teal-500', sub: '+3% improvement' },
                        { label: 'Menu Items', value: '48', icon: <Utensils size={20} />, gradient: 'from-amber-500 to-orange-500', sub: '5 new this month' },
                        { label: 'Cancellation Rate', value: '2.1%', icon: <Percent size={20} />, gradient: 'from-rose-500 to-pink-500', sub: '-0.5% vs last week' },
                    ].map((metric, i) => (
                        <motion.div
                            key={metric.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + i * 0.08 }}
                            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm group hover:shadow-lg transition-all"
                        >
                            <div className={`w-10 h-10 bg-gradient-to-br ${metric.gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                {metric.icon}
                            </div>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{metric.value}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{metric.label}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">{metric.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </RestaurantLayout>
    );
};

export default RestaurantAnalytics;
