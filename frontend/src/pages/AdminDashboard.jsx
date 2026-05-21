import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Users, Utensils, ShoppingBag, IndianRupee,
    TrendingUp, Clock, CheckCircle2, XCircle,
    ArrowUpRight, Package, Star, BarChart2
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const STATUS_CONFIG = {
    placed: { label: 'Placed', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    confirmed: { label: 'Confirmed', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
    preparing: { label: 'Preparing', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
    picked_up: { label: 'Picked Up', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
    out_for_delivery: { label: 'On the Way', color: 'bg-sky-500/20 text-sky-400 border-sky-500/30' },
    delivered: { label: 'Delivered', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
    cancelled: { label: 'Cancelled', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30' },
};

const StatCard = ({ label, value, icon: Icon, color, sub }) => (
    <div className={`bg-slate-900 border border-white/5 rounded-2xl p-5 flex items-start gap-4`}>
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
            <Icon size={22} />
        </div>
        <div className="flex-1 min-w-0">
            <p className="text-slate-400 text-xs font-medium mb-1">{label}</p>
            <p className="text-white text-2xl font-black tracking-tight">{value}</p>
            {sub && <p className="text-slate-500 text-xs mt-1">{sub}</p>}
        </div>
        <ArrowUpRight size={16} className="text-emerald-500 shrink-0 mt-1" />
    </div>
);

const SkeletonCard = () => (
    <div className="bg-slate-900 border border-white/5 rounded-2xl p-5 animate-pulse">
        <div className="flex gap-4">
            <div className="w-12 h-12 bg-slate-800 rounded-xl" />
            <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 bg-slate-800 rounded w-20" />
                <div className="h-6 bg-slate-800 rounded w-28" />
            </div>
        </div>
    </div>
);

export default function AdminDashboard() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get('/admin/stats').then(r => {
            setStats(r.data);
            setLoading(false);
        }).catch(e => {
            console.error(e);
            setLoading(false);
        });
    }, []);

    // Build chart data from monthlyRevenue
    const chartData = React.useMemo(() => {
        if (!stats?.monthlyRevenue) return [];
        return stats.monthlyRevenue.map(m => ({
            label: MONTHS[m._id.month - 1],
            revenue: m.revenue,
            orders: m.count,
        }));
    }, [stats]);

    const maxRevenue = chartData.length ? Math.max(...chartData.map(d => d.revenue)) : 1;

    return (
        <AdminLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-black text-black tracking-tight">Dashboard</h1>
                <p className="text-slate-500 text-sm mt-1">Welcome back! Here's what's happening today.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {loading ? (
                    [1, 2, 3, 4].map(n => <SkeletonCard key={n} />)
                ) : stats ? (
                    <>
                        <StatCard
                            label="Total Users"
                            value={stats.totalUsers.toLocaleString()}
                            icon={Users}
                            color="bg-blue-500/15 text-blue-400"
                            sub="All registered accounts"
                        />
                        <StatCard
                            label="Restaurants"
                            value={stats.totalRestaurants.toLocaleString()}
                            icon={Utensils}
                            color="bg-violet-500/15 text-violet-400"
                            sub="Listed on platform"
                        />
                        <StatCard
                            label="Total Orders"
                            value={stats.totalOrders.toLocaleString()}
                            icon={ShoppingBag}
                            color="bg-emerald-500/15 text-emerald-400"
                            sub={`${stats.pendingOrders} active right now`}
                        />
                        <StatCard
                            label="Total Revenue"
                            value={`₹${(stats.totalRevenue || 0).toLocaleString()}`}
                            icon={IndianRupee}
                            color="bg-amber-500/15 text-amber-400"
                            sub="Lifetime earnings"
                        />
                    </>
                ) : null}
            </div>

            {/* Status Pills Row */}
            {!loading && stats && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                        <Clock size={18} className="text-amber-400 shrink-0" />
                        <div>
                            <p className="text-slate-400 text-xs">Active Orders</p>
                            <p className="text-white font-black text-lg">{stats.pendingOrders}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                        <CheckCircle2 size={18} className="text-emerald-400 shrink-0" />
                        <div>
                            <p className="text-slate-400 text-xs">Delivered</p>
                            <p className="text-white font-black text-lg">{stats.deliveredOrders}</p>
                        </div>
                    </div>
                    <div className="bg-slate-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3">
                        <XCircle size={18} className="text-rose-400 shrink-0" />
                        <div>
                            <p className="text-slate-400 text-xs">Cancelled</p>
                            <p className="text-white font-black text-lg">{stats.cancelledOrders}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="lg:col-span-2 bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-white font-bold text-base">Revenue Trend</h3>
                            <p className="text-slate-500 text-xs mt-0.5">Last 6 months • delivered orders</p>
                        </div>
                        <BarChart2 size={18} className="text-emerald-400" />
                    </div>

                    {loading ? (
                        <div className="h-64 bg-slate-800 rounded-xl animate-pulse" />
                    ) : chartData.length === 0 ? (
                        <div className="h-64 flex items-center justify-center text-slate-500 text-sm">
                            No revenue data yet
                        </div>
                    ) : (
                        <div className="h-64 mt-4">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                    <XAxis
                                        dataKey="label"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                                        dy={10}
                                    />
                                    <YAxis
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
                                        tickFormatter={(v) => `₹${v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '12px' }}
                                        itemStyle={{ color: '#10b981', fontWeight: 'bold' }}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Top Restaurants */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h3 className="text-white font-bold text-base">Top Restaurants</h3>
                        <Star size={16} className="text-amber-400" />
                    </div>
                    {loading ? (
                        <div className="space-y-3">
                            {[1, 2, 3, 4].map(n => <div key={n} className="h-12 bg-slate-800 rounded-xl animate-pulse" />)}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {(stats?.topRestaurants || []).map((r, i) => (
                                <div key={r._id} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-xl">
                                    <div className="w-7 h-7 rounded-lg overflow-hidden bg-slate-700 shrink-0">
                                        {r.image ? (
                                            <img src={r.image} alt={r.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-black">{i + 1}</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white text-xs font-bold truncate">{r.name}</p>
                                        <p className="text-slate-500 text-[10px]">{r.count} orders</p>
                                    </div>
                                    <p className="text-emerald-400 text-xs font-bold shrink-0">₹{(r.revenue || 0).toLocaleString()}</p>
                                </div>
                            ))}
                            {!stats?.topRestaurants?.length && (
                                <p className="text-slate-500 text-sm text-center py-4">No order data yet</p>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Orders Table */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
                    <h3 className="text-white font-bold text-base">Recent Orders</h3>
                    <a href="/admin/orders" className="text-emerald-400 text-xs font-semibold hover:text-emerald-300 transition-colors">
                        View all →
                    </a>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-slate-800/50">
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Order ID</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Restaurant</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                                <th className="text-right px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Amount</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [...Array(5)].map((_, i) => (
                                    <tr key={i}>
                                        {[1, 2, 3, 4, 5].map(c => (
                                            <td key={c} className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : (stats?.recentOrders || []).map((order) => {
                                const sc = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-slate-700 text-slate-300 border-slate-600' };
                                return (
                                    <tr key={order._id} className="hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4 text-slate-300 font-mono text-xs">#{order._id.slice(-6).toUpperCase()}</td>
                                        <td className="px-6 py-4 text-white font-medium">{order.customer?.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-slate-400">{order.restaurant?.name || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${sc.color}`}>
                                                {sc.label}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-white font-bold">₹{order.totalAmount}</td>
                                    </tr>
                                );
                            })}
                            {!loading && !stats?.recentOrders?.length && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-slate-500">No orders yet</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AdminLayout>
    );
}
