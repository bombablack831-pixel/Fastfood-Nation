import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import {
    Ticket, Plus, Trash2, Edit3, RefreshCw,
    Calendar, ToggleLeft, ToggleRight, X, Check,
    IndianRupee, Percent
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';

const EMPTY_FORM = {
    code: '',
    discountType: 'flat',
    discountValue: '',
    minOrderAmount: '',
    maxDiscount: '',
    expiryDate: '',
};

function CouponModal({ coupon, onClose, onSave }) {
    const [form, setForm] = useState(coupon ? {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        minOrderAmount: coupon.minOrderAmount || '',
        maxDiscount: coupon.maxDiscount || '',
        expiryDate: coupon.expiryDate ? new Date(coupon.expiryDate).toISOString().split('T')[0] : '',
    } : EMPTY_FORM);
    const [saving, setSaving] = useState(false);

    const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async e => {
        e.preventDefault();
        if (!form.code || !form.discountValue || !form.expiryDate) {
            toast.error('Please fill all required fields');
            return;
        }
        setSaving(true);
        try {
            const payload = {
                ...form,
                code: form.code.toUpperCase(),
                discountValue: Number(form.discountValue),
                minOrderAmount: Number(form.minOrderAmount) || 0,
                maxDiscount: form.discountType === 'percent' ? Number(form.maxDiscount) || undefined : undefined,
            };
            let saved;
            if (coupon) {
                const { data } = await api.put(`/admin/coupons/${coupon._id}`, payload);
                saved = data;
            } else {
                const { data } = await api.post('/admin/coupons', payload);
                saved = data;
            }
            onSave(saved, !!coupon);
            toast.success(coupon ? 'Coupon updated!' : 'Coupon created!');
            onClose();
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to save coupon');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-slate-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl">
                <div className="flex items-center justify-between p-6 border-b border-white/5">
                    <h2 className="text-white font-black text-lg">{coupon ? 'Edit Coupon' : 'Create New Coupon'}</h2>
                    <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <X size={18} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {/* Code */}
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Coupon Code *</label>
                        <input
                            name="code"
                            value={form.code}
                            onChange={handleChange}
                            placeholder="e.g. SAVE50"
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white font-mono uppercase text-sm placeholder:text-slate-600 placeholder:normal-case focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        />
                    </div>

                    {/* Type + Value */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Type *</label>
                            <select
                                name="discountType"
                                value={form.discountType}
                                onChange={handleChange}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                            >
                                <option value="flat">Flat (₹)</option>
                                <option value="percent">Percent (%)</option>
                            </select>
                        </div>
                        <div>
                            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">
                                Value * {form.discountType === 'flat' ? '(₹)' : '(%)'}
                            </label>
                            <input
                                name="discountValue"
                                type="number"
                                min="1"
                                max={form.discountType === 'percent' ? 100 : undefined}
                                value={form.discountValue}
                                onChange={handleChange}
                                placeholder={form.discountType === 'flat' ? '100' : '20'}
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>
                    </div>

                    {/* Min Order + Max Discount */}
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Min Order (₹)</label>
                            <input
                                name="minOrderAmount"
                                type="number"
                                min="0"
                                value={form.minOrderAmount}
                                onChange={handleChange}
                                placeholder="0"
                                className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                            />
                        </div>
                        {form.discountType === 'percent' && (
                            <div>
                                <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Max Discount (₹)</label>
                                <input
                                    name="maxDiscount"
                                    type="number"
                                    min="0"
                                    value={form.maxDiscount}
                                    onChange={handleChange}
                                    placeholder="500"
                                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                                />
                            </div>
                        )}
                    </div>

                    {/* Expiry */}
                    <div>
                        <label className="text-slate-400 text-xs font-semibold uppercase tracking-wider block mb-1.5">Expiry Date *</label>
                        <input
                            name="expiryDate"
                            type="date"
                            value={form.expiryDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full bg-slate-800 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                        />
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2.5 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:bg-white/5 transition-all text-sm font-semibold"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white text-sm font-bold transition-all disabled:opacity-50"
                        >
                            {saving ? <RefreshCw size={14} className="animate-spin" /> : <Check size={14} />}
                            {coupon ? 'Update' : 'Create'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function CouponsManagement() {
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [editCoupon, setEditCoupon] = useState(null);
    const [deletingId, setDeletingId] = useState(null);
    const [togglingId, setTogglingId] = useState(null);

    const fetchCoupons = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/coupons');
            setCoupons(data);
        } catch {
            toast.error('Failed to load coupons');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchCoupons(); }, []);

    const handleModalSave = (saved, isEdit) => {
        if (isEdit) {
            setCoupons(prev => prev.map(c => c._id === saved._id ? saved : c));
        } else {
            setCoupons(prev => [saved, ...prev]);
        }
    };

    const handleDelete = async (id, code) => {
        if (!window.confirm(`Delete coupon "${code}"?`)) return;
        setDeletingId(id);
        try {
            await api.delete(`/admin/coupons/${id}`);
            setCoupons(prev => prev.filter(c => c._id !== id));
            toast.success('Coupon deleted');
        } catch {
            toast.error('Failed to delete');
        } finally {
            setDeletingId(null);
        }
    };

    const handleToggle = async (id) => {
        setTogglingId(id);
        try {
            const { data } = await api.patch(`/admin/coupons/${id}/toggle`);
            setCoupons(prev => prev.map(c => c._id === id ? { ...c, isActive: data.isActive } : c));
            toast.success(`Coupon ${data.isActive ? 'activated' : 'deactivated'}`);
        } catch {
            toast.error('Failed to toggle');
        } finally {
            setTogglingId(null);
        }
    };

    const openCreate = () => { setEditCoupon(null); setModalOpen(true); };
    const openEdit = (coupon) => { setEditCoupon(coupon); setModalOpen(true); };

    const isExpired = (date) => new Date(date) < new Date();

    return (
        <AdminLayout>
            {modalOpen && (
                <CouponModal
                    coupon={editCoupon}
                    onClose={() => setModalOpen(false)}
                    onSave={handleModalSave}
                />
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-b tracking-tight">Coupons</h1>
                    <p className="text-slate-500 text-sm mt-0.5">
                        {coupons.filter(c => c.isActive).length} active · {coupons.filter(c => !c.isActive).length} disabled
                    </p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={fetchCoupons}
                        className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 border border-white/10 rounded-xl text-slate-300 hover:text-white transition-all text-sm font-medium"
                    >
                        <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-emerald-500/20"
                    >
                        <Plus size={16} />
                        New Coupon
                    </button>
                </div>
            </div>

            {/* Cards Grid */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="bg-slate-900 border border-white/5 rounded-2xl p-5 animate-pulse space-y-3">
                            <div className="h-4 bg-slate-800 rounded w-3/4" />
                            <div className="h-8 bg-slate-800 rounded w-1/2" />
                            <div className="h-3 bg-slate-800 rounded" />
                            <div className="h-3 bg-slate-800 rounded w-2/3" />
                        </div>
                    ))}
                </div>
            ) : coupons.length === 0 ? (
                <div className="bg-slate-900 border border-white/5 rounded-2xl p-12 text-center">
                    <Ticket size={40} className="text-slate-600 mx-auto mb-3" />
                    <p className="text-slate-400 font-medium">No coupons created yet</p>
                    <button onClick={openCreate} className="mt-4 px-5 py-2 bg-emerald-500 text-white rounded-xl text-sm font-bold hover:bg-emerald-400 transition-all">
                        Create First Coupon
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coupons.map(coupon => {
                        const expired = isExpired(coupon.expiryDate);
                        const daysLeft = Math.ceil((new Date(coupon.expiryDate) - new Date()) / (1000 * 60 * 60 * 24));

                        return (
                            <div key={coupon._id} className={`bg-slate-900 border rounded-2xl p-5 flex flex-col gap-4 hover:border-white/10 transition-all ${!coupon.isActive || expired ? 'border-white/5 opacity-70' : 'border-emerald-500/15'}`}>
                                {/* Top Row */}
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2.5">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${coupon.discountType === 'percent' ? 'bg-violet-500/15' : 'bg-emerald-500/15'}`}>
                                            {coupon.discountType === 'percent'
                                                ? <Percent size={18} className="text-violet-400" />
                                                : <IndianRupee size={18} className="text-emerald-400" />}
                                        </div>
                                        <div>
                                            <p className="text-white font-black text-base tracking-widest">{coupon.code}</p>
                                            <p className={`text-[10px] font-semibold uppercase tracking-wider ${coupon.discountType === 'percent' ? 'text-violet-400' : 'text-emerald-400'}`}>
                                                {coupon.discountType === 'flat' ? 'Flat Discount' : 'Percent Off'}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Active/Inactive badge */}
                                    <span className={`text-[10px] font-bold px-2 py-1 rounded-lg border ${
                                        expired
                                            ? 'bg-slate-700/50 text-slate-400 border-slate-600/30'
                                            : coupon.isActive
                                            ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/25'
                                            : 'bg-rose-500/15 text-rose-400 border-rose-500/25'
                                    }`}>
                                        {expired ? 'Expired' : coupon.isActive ? 'Active' : 'Inactive'}
                                    </span>
                                </div>

                                {/* Discount Value */}
                                <div className="bg-slate-800/60 rounded-xl px-4 py-3 text-center">
                                    <p className={`text-3xl font-black tracking-tight ${coupon.discountType === 'percent' ? 'text-violet-400' : 'text-emerald-400'}`}>
                                        {coupon.discountType === 'flat' ? `₹${coupon.discountValue}` : `${coupon.discountValue}%`}
                                        <span className="text-slate-500 text-sm font-medium ml-1">OFF</span>
                                    </p>
                                </div>

                                {/* Details */}
                                <div className="space-y-1.5 text-xs text-slate-400">
                                    <div className="flex justify-between">
                                        <span>Min Order:</span>
                                        <span className="text-slate-300 font-medium">₹{coupon.minOrderAmount || 0}</span>
                                    </div>
                                    {coupon.maxDiscount && coupon.discountType === 'percent' && (
                                        <div className="flex justify-between">
                                            <span>Max Discount:</span>
                                            <span className="text-slate-300 font-medium">₹{coupon.maxDiscount}</span>
                                        </div>
                                    )}
                                    <div className="flex justify-between items-center">
                                        <span className="flex items-center gap-1">
                                            <Calendar size={11} />
                                            Expires:
                                        </span>
                                        <span className={`font-medium ${expired ? 'text-rose-400' : daysLeft <= 7 ? 'text-amber-400' : 'text-slate-300'}`}>
                                            {new Date(coupon.expiryDate).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                            {!expired && daysLeft <= 7 && <span className="ml-1 text-amber-400">({daysLeft}d left)</span>}
                                        </span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                                    {/* Toggle */}
                                    {!expired && (
                                        <button
                                            onClick={() => handleToggle(coupon._id)}
                                            disabled={togglingId === coupon._id}
                                            className={`flex items-center gap-1.5 flex-1 justify-center py-2 rounded-xl text-xs font-semibold border transition-all disabled:opacity-50 ${
                                                coupon.isActive
                                                    ? 'border-rose-500/20 text-rose-400 hover:bg-rose-500/10'
                                                    : 'border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/10'
                                            }`}
                                        >
                                            {togglingId === coupon._id
                                                ? <RefreshCw size={12} className="animate-spin" />
                                                : coupon.isActive ? <ToggleRight size={14} /> : <ToggleLeft size={14} />}
                                            {coupon.isActive ? 'Disable' : 'Enable'}
                                        </button>
                                    )}

                                    {/* Edit */}
                                    <button
                                        onClick={() => openEdit(coupon)}
                                        className="p-2 rounded-xl text-slate-500 hover:text-white hover:bg-white/5 border border-white/5 transition-all"
                                    >
                                        <Edit3 size={14} />
                                    </button>

                                    {/* Delete */}
                                    <button
                                        onClick={() => handleDelete(coupon._id, coupon.code)}
                                        disabled={deletingId === coupon._id}
                                        className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 border border-white/5 transition-all disabled:opacity-50"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </AdminLayout>
    );
}
