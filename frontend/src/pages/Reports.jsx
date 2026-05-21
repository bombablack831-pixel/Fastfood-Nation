import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    BarChart2, TrendingUp, IndianRupee, ShoppingBag,
    Users, Utensils, RefreshCw, ArrowUpRight, ArrowDownRight,
    CheckCircle2, XCircle, Clock
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function Reports() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/stats');
            setStats(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    // Build chart from monthly data
    const chartData = (stats?.monthlyRevenue || []).map(m => ({
        label: MONTHS[m._id.month - 1],
        revenue: m.revenue,
        orders: m.count,
    }));
    const maxRevenue = chartData.length ? Math.max(...chartData.map(d => d.revenue), 1) : 1;
    const maxOrders = chartData.length ? Math.max(...chartData.map(d => d.orders), 1) : 1;

    const deliveryRate = stats ? ((stats.deliveredOrders / (stats.totalOrders || 1)) * 100).toFixed(1) : 0;
    const cancelRate = stats ? ((stats.cancelledOrders / (stats.totalOrders || 1)) * 100).toFixed(1) : 0;
    const avgOrderValue = stats ? (stats.totalRevenue / (stats.deliveredOrders || 1)).toFixed(0) : 0;

    const Skeleton = ({ className }) => (
        <div className={`bg-slate-800 rounded-xl animate-pulse ${className}`} />
    );

    return (
        <AdminLayout>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-white tracking-tight">Reports & Analytics</h1>
                    <p className="text-slate-500 text-sm mt-0.5">Platform performance overview</p>
                </div>
                <button
                    onClick={fetchStats}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* KPI Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {[
                    {
                        label: 'Total Revenue',
                        value: loading ? '...' : `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
                        icon: IndianRupee,
                        color: 'text-emerald-400',
                        bg: 'bg-emerald-500/10',
                        sub: 'Lifetime earnings'
                    },
                    {
                        label: 'Avg Order Value',
                        value: loading ? '...' : `₹${avgOrderValue}`,
                        icon: TrendingUp,
                        color: 'text-blue-400',
                        bg: 'bg-blue-500/10',
                        sub: 'Per delivered order'
                    },
                    {
                        label: 'Delivery Rate',
                        value: loading ? '...' : `${deliveryRate}%`,
                        icon: CheckCircle2,
                        color: 'text-violet-400',
                        bg: 'bg-violet-500/10',
                        sub: `${stats?.deliveredOrders || 0} delivered`
                    },
                    {
                        label: 'Cancellation Rate',
                        value: loading ? '...' : `${cancelRate}%`,
                        icon: XCircle,
                        color: 'text-rose-400',
                        bg: 'bg-rose-500/10',
                        sub: `${stats?.cancelledOrders || 0} cancelled`
                    },
                ].map((kpi, i) => (
                    <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-10 h-10 ${kpi.bg} rounded-xl flex items-center justify-center ${kpi.color}`}>
                                <kpi.icon size={18} />
                            </div>
                            <ArrowUpRight size={14} className="text-emerald-500" />
                        </div>
                        <p className="text-slate-500 text-xs font-medium mb-1">{kpi.label}</p>
                        {loading ? (
                            <Skeleton className="h-7 w-24 mb-1" />
                        ) : (
                            <p className="text-white text-xl font-black">{kpi.value}</p>
                        )}
                        <p className="text-slate-600 text-[10px] mt-0.5">{kpi.sub}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Chart */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-white font-bold">Monthly Revenue</h3>
                            <p className="text-slate-500 text-xs">Delivered orders only</p>
                        </div>
                        <BarChart2 size={16} className="text-emerald-400" />
                    </div>
                    {loading ? (
                        <Skeleton className="h-44" />
                    ) : chartData.length === 0 ? (
                        <div className="h-44 flex items-center justify-center text-slate-500 text-sm">No revenue data yet</div>
                    ) : (
                        <>
                            <div className="flex items-end gap-2 h-44">
                                {chartData.map((d, i) => (
                                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                                        <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                                            <div
                                                className="w-full bg-emerald-500/20 hover:bg-emerald-500/40 border border-emerald-500/30 rounded-lg relative transition-all cursor-pointer"
                                                style={{ height: `${(d.revenue / maxRevenue) * 100}%`, minHeight: '4px' }}
                                            >
                                                <div className="absolute inset-x-0 top-0 h-0.5 bg-emerald-400 rounded-t-lg" />
                                                <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl pointer-events-none">
                                                    ₹{d.revenue.toLocaleString()}
                                                </div>
                                            </div>
                                        </div>
                                        <span className="text-slate-500 text-[9px] font-medium">{d.label}</span>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Orders Chart */}
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-white font-bold">Monthly Orders</h3>
                            <p className="text-slate-500 text-xs">Order volume trend</p>
                        </div>
                        <ShoppingBag size={16} className="text-violet-400" />
                    </div>
                    {loading ? (
                        <Skeleton className="h-44" />
                    ) : chartData.length === 0 ? (
                        <div className="h-44 flex items-center justify-center text-slate-500 text-sm">No order data yet</div>
                    ) : (
                        <div className="flex items-end gap-2 h-44">
                            {chartData.map((d, i) => (
                                <div key={i} className="flex-1 flex flex-col items-center gap-1.5 group">
                                    <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                                        <div
                                            className="w-full bg-violet-500/20 hover:bg-violet-500/40 border border-violet-500/30 rounded-lg relative transition-all cursor-pointer"
                                            style={{ height: `${(d.orders / maxOrders) * 100}%`, minHeight: '4px' }}
                                        >
                                            <div className="absolute inset-x-0 top-0 h-0.5 bg-violet-400 rounded-t-lg" />
                                            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 border border-white/10 text-white text-[10px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity z-10 whitespace-nowrap shadow-xl pointer-events-none">
                                                {d.orders} orders
                                            </div>
                                        </div>
                                    </div>
                                    <span className="text-slate-500 text-[9px] font-medium">{d.label}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Summary Table */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="px-6 py-4 border-b border-white/5">
                    <h3 className="text-white font-bold">Platform Summary</h3>
                </div>
                <div className="divide-y divide-white/5">
                    {[
                        { label: 'Total Users', value: stats?.totalUsers?.toLocaleString(), icon: Users, color: 'text-blue-400' },
                        { label: 'Total Restaurants', value: stats?.totalRestaurants?.toLocaleString(), icon: Utensils, color: 'text-violet-400' },
                        { label: 'Total Orders', value: stats?.totalOrders?.toLocaleString(), icon: ShoppingBag, color: 'text-emerald-400' },
                        { label: 'Active Orders', value: stats?.pendingOrders?.toLocaleString(), icon: Clock, color: 'text-amber-400' },
                        { label: 'Delivered Orders', value: stats?.deliveredOrders?.toLocaleString(), icon: CheckCircle2, color: 'text-emerald-400' },
                        { label: 'Cancelled Orders', value: stats?.cancelledOrders?.toLocaleString(), icon: XCircle, color: 'text-rose-400' },
                        { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: IndianRupee, color: 'text-emerald-400' },
                    ].map((row, i) => (
                        <div key={i} className="flex items-center justify-between px-6 py-3.5 hover:bg-white/5 transition-colors">
                            <div className="flex items-center gap-3">
                                <row.icon size={15} className={row.color} />
                                <span className="text-slate-400 text-sm">{row.label}</span>
                            </div>
                            {loading ? (
                                <div className="h-4 w-16 bg-slate-800 rounded animate-pulse" />
                            ) : (
                                <span className="text-white font-bold text-sm">{row.value}</span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}
