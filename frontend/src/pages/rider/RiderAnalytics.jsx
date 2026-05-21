import React, { useState } from 'react';
import RiderLayout from '../../layouts/RiderLayout';
import { motion } from 'framer-motion';
import {
    BarChart3, TrendingUp, Clock, Star, Route, Bike,
    ArrowUpRight, ArrowDownRight, Target, Award, Zap,
    MapPin, Calendar, CheckCircle2
} from 'lucide-react';

const hourlyData = [
    { hour: '6AM', orders: 2 }, { hour: '7AM', orders: 5 }, { hour: '8AM', orders: 8 },
    { hour: '9AM', orders: 6 }, { hour: '10AM', orders: 4 }, { hour: '11AM', orders: 7 },
    { hour: '12PM', orders: 12 }, { hour: '1PM', orders: 15 }, { hour: '2PM', orders: 9 },
    { hour: '3PM', orders: 4 }, { hour: '4PM', orders: 3 }, { hour: '5PM', orders: 6 },
    { hour: '6PM', orders: 10 }, { hour: '7PM', orders: 14 }, { hour: '8PM', orders: 18 },
    { hour: '9PM', orders: 16 }, { hour: '10PM', orders: 8 }, { hour: '11PM', orders: 3 },
];
const maxOrders = Math.max(...hourlyData.map(d => d.orders));

const RiderAnalytics = () => {
    const [period, setPeriod] = useState('today');

    return (
        <RiderLayout>
            <div className="space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Performance Analytics</h1>
                        <p className="text-sm font-medium text-slate-400 mt-1">Track your delivery performance metrics</p>
                    </div>
                    <div className="flex items-center gap-1 bg-white border border-slate-100 p-1 rounded-xl shadow-sm">
                        {['today', 'week', 'month'].map(p => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${
                                    period === p ? 'bg-slate-900 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'
                                }`}
                            >
                                {p}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Performance Scorecard */}
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden">
                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl" />

                    <div className="relative z-10">
                        <div className="flex items-center gap-2 mb-4">
                            <Award size={16} className="text-yellow-400" />
                            <span className="text-[10px] font-black text-yellow-400/80 uppercase tracking-widest">Performance Score</span>
                        </div>

                        <div className="flex items-end gap-4 mb-6">
                            <span className="text-6xl font-black text-white tracking-tighter">92</span>
                            <span className="text-white/40 font-black text-xl mb-2">/100</span>
                            <div className="flex items-center gap-1 text-emerald-400 mb-3 ml-4">
                                <ArrowUpRight size={16} />
                                <span className="text-sm font-black">+5 pts</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Acceptance Rate', value: '94%', icon: <Target size={16} />, color: 'text-emerald-400' },
                                { label: 'On-Time Rate', value: '97%', icon: <Clock size={16} />, color: 'text-sky-400' },
                                { label: 'Customer Rating', value: '4.9', icon: <Star size={16} />, color: 'text-yellow-400' },
                                { label: 'Completion Rate', value: '99%', icon: <CheckCircle2 size={16} />, color: 'text-violet-400' },
                            ].map((metric, i) => (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5"
                                >
                                    <div className={`${metric.color} mb-2`}>{metric.icon}</div>
                                    <p className="text-2xl font-black text-white tracking-tighter">{metric.value}</p>
                                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest mt-0.5">{metric.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Hourly Activity Chart */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-lg font-black text-slate-900">Activity by Hour</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Deliveries per hour today</p>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-emerald-500 bg-emerald-50 px-3 py-1.5 rounded-lg">
                            <Zap size={12} /> Peak: 8PM
                        </div>
                    </div>

                    <div className="flex items-end gap-1 h-32 overflow-x-auto no-scrollbar">
                        {hourlyData.map((d, i) => {
                            const height = (d.orders / maxOrders) * 100;
                            const isPeak = d.orders >= 14;
                            return (
                                <div key={d.hour} className="flex-1 min-w-[24px] flex flex-col items-center gap-1">
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${height}%` }}
                                        transition={{ duration: 0.4, delay: i * 0.03 }}
                                        className={`w-full rounded-md ${
                                            isPeak
                                                ? 'bg-gradient-to-t from-primary to-rose-400'
                                                : 'bg-slate-100 hover:bg-slate-200'
                                        }`}
                                    />
                                    <span className="text-[7px] font-bold text-slate-400 whitespace-nowrap">{d.hour}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {[
                        { label: 'Total Distance', value: '342 km', sub: 'This month', icon: <Route size={20} />, gradient: 'from-blue-500 to-indigo-500' },
                        { label: 'Avg Delivery Time', value: '22 min', sub: '-3 min from last week', icon: <Clock size={20} />, gradient: 'from-emerald-500 to-teal-500' },
                        { label: 'Total Trips', value: '156', sub: 'This month', icon: <Bike size={20} />, gradient: 'from-amber-500 to-orange-500' },
                        { label: 'Areas Covered', value: '12', sub: 'Active zones', icon: <MapPin size={20} />, gradient: 'from-violet-500 to-purple-500' },
                        { label: 'Peak Hours', value: '7-9 PM', sub: 'Most active window', icon: <Calendar size={20} />, gradient: 'from-rose-500 to-pink-500' },
                        { label: 'Growth', value: '+24%', sub: 'vs last month', icon: <TrendingUp size={20} />, gradient: 'from-sky-500 to-cyan-500' },
                    ].map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 + i * 0.08 }}
                            className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-lg transition-all group"
                        >
                            <div className={`w-10 h-10 bg-gradient-to-br ${stat.gradient} rounded-xl flex items-center justify-center text-white mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                                {stat.icon}
                            </div>
                            <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{stat.label}</p>
                            <p className="text-[10px] font-medium text-slate-400 mt-1">{stat.sub}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Achievement Badges */}
                <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-black text-slate-900 mb-6 flex items-center gap-2">
                        <Award size={18} className="text-yellow-500" /> Achievements
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { title: 'Speed Demon', desc: '100+ deliveries under 20 min', emoji: '⚡', unlocked: true },
                            { title: 'Perfect Score', desc: '50+ 5-star ratings', emoji: '⭐', unlocked: true },
                            { title: 'Early Bird', desc: '20+ deliveries before 9 AM', emoji: '🌅', unlocked: true },
                            { title: 'Night Owl', desc: '30+ late-night deliveries', emoji: '🦉', unlocked: false },
                        ].map((badge, i) => (
                            <div
                                key={badge.title}
                                className={`rounded-2xl p-5 text-center border transition-all ${
                                    badge.unlocked
                                        ? 'bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100 shadow-sm'
                                        : 'bg-slate-50 border-slate-100 opacity-50'
                                }`}
                            >
                                <span className="text-3xl mb-2 block">{badge.emoji}</span>
                                <p className="text-xs font-black text-slate-900 mb-0.5">{badge.title}</p>
                                <p className="text-[9px] font-medium text-slate-400">{badge.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
};

export default RiderAnalytics;
