import React, { useState, useEffect, useMemo } from 'react';
import api from '../utils/api';
import {
    Users, Mail, Shield, Trash2, Search,
    ChevronDown, RefreshCw, UserCheck, UserX, Crown
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';
import { toast } from 'react-toastify';

const ROLE_CONFIG = {
    customer: { label: 'Customer', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30', icon: Users },
    restaurantOwner: { label: 'Owner', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30', icon: UserCheck },
    deliveryBoy: { label: 'Delivery', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: UserX },
    admin: { label: 'Admin', color: 'bg-rose-500/20 text-rose-400 border-rose-500/30', icon: Crown },
};

const ROLES = ['customer', 'restaurantOwner', 'deliveryBoy', 'admin'];

export default function UsersManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('all');
    const [deletingId, setDeletingId] = useState(null);
    const [roleChangingId, setRoleChangingId] = useState(null);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get('/admin/users');
            setUsers(data);
        } catch {
            toast.error('Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUsers(); }, []);

    const filtered = useMemo(() => {
        return users.filter(u => {
            const matchRole = filterRole === 'all' || u.role === filterRole;
            const matchSearch = !search ||
                u.name?.toLowerCase().includes(search.toLowerCase()) ||
                u.email?.toLowerCase().includes(search.toLowerCase());
            return matchRole && matchSearch;
        });
    }, [users, search, filterRole]);

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
        setDeletingId(id);
        try {
            await api.delete(`/admin/users/${id}`);
            setUsers(prev => prev.filter(u => u._id !== id));
            toast.success('User deleted');
        } catch {
            toast.error('Failed to delete user');
        } finally {
            setDeletingId(null);
        }
    };

    const handleRoleChange = async (id, newRole) => {
        setRoleChangingId(id);
        try {
            const { data } = await api.patch(`/admin/users/${id}/role`, { role: newRole });
            setUsers(prev => prev.map(u => u._id === id ? { ...u, role: data.role } : u));
            toast.success('Role updated');
        } catch {
            toast.error('Failed to update role');
        } finally {
            setRoleChangingId(null);
        }
    };

    const roleCounts = useMemo(() => {
        const counts = { all: users.length };
        ROLES.forEach(r => { counts[r] = users.filter(u => u.role === r).length; });
        return counts;
    }, [users]);

    return (
        <AdminLayout>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-black tracking-tight">Users Management</h1>
                    <p className="text-slate-500 text-sm mt-0.5">{users.length} total registered users</p>
                </div>
                <button
                    onClick={fetchUsers}
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
                        placeholder="Search by name or email..."
                        className="w-full bg-slate-900 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white text-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-emerald-500/50"
                    />
                </div>
                <div className="flex gap-2 flex-wrap">
                    {['all', ...ROLES].map(role => (
                        <button
                            key={role}
                            onClick={() => setFilterRole(role)}
                            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all ${
                                filterRole === role
                                    ? 'bg-emerald-500 border-emerald-500 text-white'
                                    : 'bg-slate-900 border-white/10 text-slate-400 hover:text-white'
                            }`}
                        >
                            {role === 'all' ? 'All' : ROLE_CONFIG[role]?.label}
                            <span className="ml-1.5 opacity-60">({roleCounts[role] || 0})</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
            <div className="bg-slate-900 border border-white/5 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-white/5 bg-slate-800/50">
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">User</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Email</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Role</th>
                                <th className="text-left px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Joined</th>
                                <th className="text-right px-6 py-3 text-slate-400 text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {loading ? (
                                [...Array(6)].map((_, i) => (
                                    <tr key={i}>
                                        {[1,2,3,4,5].map(c => (
                                            <td key={c} className="px-6 py-4">
                                                <div className="h-4 bg-slate-800 rounded animate-pulse" />
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                        No users found
                                    </td>
                                </tr>
                            ) : filtered.map(user => {
                                const rc = ROLE_CONFIG[user.role] || { label: user.role, color: 'bg-slate-700 text-slate-300 border-slate-600' };
                                return (
                                    <tr key={user._id} className="hover:bg-white/2 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-black text-sm shrink-0">
                                                    {user.name?.charAt(0)?.toUpperCase()}
                                                </div>
                                                <span className="text-white font-medium">{user.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-slate-400">
                                                <Mail size={13} />
                                                {user.email}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="relative group inline-block">
                                                <select
                                                    value={user.role}
                                                    disabled={roleChangingId === user._id}
                                                    onChange={e => handleRoleChange(user._id, e.target.value)}
                                                    className={`appearance-none pr-7 pl-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer focus:outline-none ${rc.color} bg-transparent`}
                                                >
                                                    {ROLES.map(r => (
                                                        <option key={r} value={r} className="bg-slate-900 text-white">
                                                            {ROLE_CONFIG[r].label}
                                                        </option>
                                                    ))}
                                                </select>
                                                <ChevronDown size={12} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none opacity-60" />
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-slate-500 text-xs">
                                            {new Date(user.createdAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user._id, user.name)}
                                                disabled={deletingId === user._id}
                                                className="p-2 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all disabled:opacity-50"
                                                title="Delete user"
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
                <div className="px-6 py-3 border-t border-white/5 text-slate-500 text-xs">
                    Showing {filtered.length} of {users.length} users
                </div>
            </div>
        </AdminLayout>
    );
}
