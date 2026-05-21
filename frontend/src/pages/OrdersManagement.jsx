import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import {
    ShoppingBag, Search, RefreshCw, ChevronDown,
    User, Utensils, IndianRupee, Calendar, Eye
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';

const ALL_STATUSES = ['placed', 'confirmed', 'preparing', 'picked_up', 'out_for_delivery', 'delivered', 'cancelled'];

const STATUS_CONFIG = {
    placed:           { label: 'Placed',          color: 'bg-blue-500/15 text-blue-400 border-blue-500/25' },
    confirmed:        { label: 'Confirmed',        color: 'bg-violet-500/15 text-violet-400 border-violet-500/25' },
    preparing:        { label: 'Preparing',        color: 'bg-amber-500/15 text-amber-400 border-amber-500/25' },
    picked_up:        { label: 'Picked Up',        color: 'bg-orange-500/15 text-orange-400 border-orange-500/25' },
    out_for_delivery: { label: 'Out for Delivery', color: 'bg-sky-500/15 text-sky-400 border-sky-500/25' },
    delivered:        { label: 'Delivered',        color: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25' },
    cancelled:        { label: 'Cancelled',        color: 'bg-rose-500/15 text-rose-400 border-rose-500/25' },
};

export default function OrdersManagement() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [updatingId, setUpdatingId] = useState(null);
    const [expandedId, setExpandedId] = useState(null);

    const fetchOrders = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/orders');
            setOrders(data);
        } catch {
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchOrders(); }, []);

    const filtered = useMemo(() => {
        return orders.filter(o => {
            const matchStatus = filterStatus === 'all' || o.status === filterStatus;
            const matchSearch = !search ||
                o._id.toLowerCase().includes(search.toLowerCase()) ||
                o.customer?.name?.toLowerCase().includes(search.toLowerCase()) ||
                o.restaurant?.name?.toLowerCase().includes(search.toLowerCase());
            return matchStatus && matchSearch;
        });
    }, [orders, search, filterStatus]);

    const handleStatusChange = async (id, newStatus) => {
        setUpdatingId(id);
        try {
            const { data } = await api.patch(`/admin/orders/${id}/status`, { status: newStatus });
            setOrders(prev => prev.map(o => o._id === id ? { ...o, status: data.status } : o));
            toast.success('Order status updated');
        } catch {
            toast.error('Failed to update status');
        } finally {
            setUpdatingId(null);
        }
    };

    const statusCounts = useMemo(() => {
        const counts = { all: orders.length };
        ALL_STATUSES.forEach(s => { counts[s] = orders.filter(o => o.status === s).length; });
        return counts;
    }, [orders]);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-b tracking-tight">Orders Management</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{orders.length} total orders on platform</p>
                </div>
                <button
                    onClick={fetchOrders}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Search */}
            <div className="relative mb-4">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Search by Order ID, Customer, or Restaurant..."
                    className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
                <button
                    onClick={() => setFilterStatus('all')}
                    className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        filterStatus === 'all'
                            ? 'bg-emerald-500 border-emerald-500 text-white'
                            : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                    }`}
                >
                    All ({statusCounts.all})
                </button>
                {ALL_STATUSES.map(s => (
                    <button
                        key={s}
                        onClick={() => setFilterStatus(s)}
                        className={`shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                            filterStatus === s
                                ? 'bg-emerald-500 border-emerald-500 text-white'
                                : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                        }`}
                    >
                        {STATUS_CONFIG[s].label} ({statusCounts[s] || 0})
                    </button>
                ))}
            </div>

            {/* Orders Table */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-slate-800/50">
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Order</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Customer</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Restaurant</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Status</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Payment</th>
                                <th className="text-right px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Amount</th>
                                <th className="text-center px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Change Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}>
                                        {[1,2,3,4,5,6,7].map(c => (
                                            <td key={c} className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                        No orders found
                                    </td>
                                </tr>
                            ) : filtered.map(order => {
                                const sc = STATUS_CONFIG[order.status] || { label: order.status, color: 'bg-slate-700 text-slate-300 border-slate-600' };
                                return (
                                    <tr key={order._id} className="hover:bg-white/2 transition-colors">
                                        {/* Order ID */}
                                        <td className="px-6 py-4">
                                            <div>
                                                <p className="text-slate-300 font-mono text-xs font-bold">
                                                    #{order._id.slice(-8).toUpperCase()}
                                                </p>
                                                <p className="text-slate-600 text-[10px] mt-0.5">
                                                    {new Date(order.createdAt).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                                                </p>
                                            </div>
                                        </td>

                                        {/* Customer */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                                                    <User size={13} />
                                                </div>
                                                <div>
                                                    <p className="text-white text-xs font-medium">{order.customer?.name || 'N/A'}</p>
                                                    <p className="text-slate-500 text-[10px]">{order.customer?.email}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Restaurant */}
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <Utensils size={13} className="text-slate-500 shrink-0" />
                                                <span className="text-slate-300 text-xs">{order.restaurant?.name || 'N/A'}</span>
                                            </div>
                                        </td>

                                        {/* Status Badge */}
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${sc.color}`}>
                                                {sc.label}
                                            </span>
                                        </td>

                                        {/* Payment */}
                                        <td className="px-6 py-4">
                                            <span className={`text-xs font-semibold ${
                                                order.paymentStatus === 'paid'
                                                    ? 'text-emerald-400'
                                                    : order.paymentStatus === 'failed'
                                                    ? 'text-rose-400'
                                                    : 'text-amber-400'
                                            }`}>
                                                {order.paymentStatus || 'pending'}
                                            </span>
                                        </td>

                                        {/* Amount */}
                                        <td className="px-6 py-4 text-right">
                                            <span className="text-white font-bold text-sm">₹{order.totalAmount}</span>
                                        </td>

                                        {/* Status Changer */}
                                        <td className="px-6 py-4 text-center">
                                            <div className="relative inline-block">
                                                <select
                                                    value={order.status}
                                                    disabled={updatingId === order._id}
                                                    onChange={e => handleStatusChange(order._id, e.target.value)}
                                                    className="appearance-none bg-slate-800 border border-white/10 text-white text-xs rounded-lg pl-3 pr-7 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 cursor-pointer disabled:opacity-50"
                                                >
                                                    {ALL_STATUSES.map(s => (
                                                        <option key={s} value={s} className="bg-slate-900">
                                                            {STATUS_CONFIG[s].label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400" />
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 border-t border-white/5 flex items-center justify-between text-slate-500 text-xs">
                    <span>Showing {filtered.length} of {orders.length} orders</span>
                    {filterStatus !== 'all' && (
                        <button onClick={() => setFilterStatus('all')} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                            Clear filter
                        </button>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}
