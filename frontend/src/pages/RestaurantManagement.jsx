import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import {
    Utensils, MapPin, Star, Trash2, Search,
    RefreshCw, ToggleLeft, ToggleRight, ExternalLink
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';

export default function RestaurantManagement() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all'); // all, open, closed
    const [togglingId, setTogglingId] = useState(null);
    const [deletingId, setDeletingId] = useState(null);

    const fetchRestaurants = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/restaurants');
            setRestaurants(data);
        } catch {
            toast.error('Failed to load restaurants');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRestaurants(); }, []);

    const filtered = useMemo(() => {
        return restaurants.filter(r => {
            const matchFilter =
                filter === 'all' ||
                (filter === 'open' && r.isOpened) ||
                (filter === 'closed' && !r.isOpened);
            const matchSearch = !search ||
                r.name?.toLowerCase().includes(search.toLowerCase()) ||
                r.owner?.name?.toLowerCase().includes(search.toLowerCase()) ||
                r.address?.toLowerCase().includes(search.toLowerCase());
            return matchFilter && matchSearch;
        });
    }, [restaurants, search, filter]);

    const handleToggle = async (id) => {
        setTogglingId(id);
        try {
            const { data } = await api.patch(`/admin/restaurants/${id}/toggle`);
            setRestaurants(prev =>
                prev.map(r => r._id === id ? { ...r, isOpened: data.isOpened } : r)
            );
            toast.success(`Restaurant ${data.isOpened ? 'activated' : 'deactivated'}`);
        } catch {
            toast.error('Failed to toggle status');
        } finally {
            setTogglingId(null);
        }
    };

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete restaurant "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await api.delete(`/admin/restaurants/${id}`);
            setRestaurants(prev => prev.filter(r => r._id !== id));
            toast.success('Restaurant deleted');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const openCount = restaurants.filter(r => r.isOpened).length;
    const closedCount = restaurants.filter(r => !r.isOpened).length;

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-black tracking-tight">Restaurants</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {openCount} active · {closedCount} inactive
                    </p>
                </div>
                <button
                    onClick={fetchRestaurants}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white hover:bg-slate-700 transition-all text-sm font-medium"
                >
                    <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <div className="relative flex-1">
                    <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                    <input
                        type="text"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        placeholder="Search restaurants, owners, address..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                </div>
                <div className="flex gap-2">
                    {[
                        { key: 'all', label: `All (${restaurants.length})` },
                        { key: 'open', label: `Active (${openCount})` },
                        { key: 'closed', label: `Inactive (${closedCount})` },
                    ].map(f => (
                        <button
                            key={f.key}
                            onClick={() => setFilter(f.key)}
                            className={`px-4 py-2.5 rounded-xl text-xs font-semibold border transition-all ${
                                filter === f.key
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                            }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Grid Cards */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden animate-pulse">
                            <div className="h-36 bg-slate-800" />
                            <div className="p-4 space-y-3">
                                <div className="h-4 bg-slate-800 rounded w-3/4" />
                                <div className="h-3 bg-slate-800 rounded w-1/2" />
                                <div className="h-8 bg-slate-800 rounded" />
                            </div>
                        </div>
                    ))}
                </div>
            ) : filtered.length === 0 ? (
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-12 text-center text-slate-500">
                    No restaurants found
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(res => (
                        <div key={res._id} className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:border-white/10 transition-all group">
                            {/* Image */}
                            <div className="relative h-36 bg-slate-800 overflow-hidden">
                                {res.image ? (
                                    <img src={res.image} alt={res.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Utensils size={32} className="text-slate-600" />
                                    </div>
                                )}
                                {/* Status Badge */}
                                <div className={`absolute top-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wide border ${
                                    res.isOpened
                                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                                }`}>
                                    {res.isOpened ? '● Open' : '● Closed'}
                                </div>
                            </div>

                            <div className="p-4">
                                <div className="mb-3">
                                    <h3 className="text-white font-bold text-base truncate">{res.name}</h3>
                                    {res.cuisine?.length > 0 && (
                                        <p className="text-slate-500 text-xs mt-0.5">{res.cuisine.join(' · ')}</p>
                                    )}
                                </div>

                                <div className="space-y-1.5 mb-4 text-xs text-slate-400">
                                    <div className="flex items-center gap-2">
                                        <Star size={12} className="text-amber-400 shrink-0" />
                                        <span>{res.rating || 0} rating · {res.numReviews || 0} reviews</span>
                                    </div>
                                    {res.address && (
                                        <div className="flex items-center gap-2">
                                            <MapPin size={12} className="text-slate-500 shrink-0" />
                                            <span className="truncate">{res.address}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-2">
                                        <span className="text-slate-600">Owner:</span>
                                        <span className="text-slate-300 font-medium">{res.owner?.name}</span>
                                        <span className="text-slate-600">({res.owner?.email})</span>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                                    {/* Toggle */}
                                    <button
                                        onClick={() => handleToggle(res._id)}
                                        disabled={togglingId === res._id}
                                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs font-semibold transition-all border disabled:opacity-50 ${
                                            res.isOpened
                                                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 hover:bg-rose-500/20'
                                                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                                        }`}
                                    >
                                        {togglingId === res._id ? (
                                            <RefreshCw size={12} className="animate-spin" />
                                        ) : res.isOpened ? (
                                            <><ToggleRight size={14} /> Deactivate</>
                                        ) : (
                                            <><ToggleLeft size={14} /> Activate</>
                                        )}
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(res._id, res.name)}
                                        disabled={deletingId === res._id}
                                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-all disabled:opacity-50"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <p className="text-slate-600 text-xs mt-4 text-right">
                Showing {filtered.length} of {restaurants.length} restaurants
            </p>
        </AdminLayout>
    );
}
