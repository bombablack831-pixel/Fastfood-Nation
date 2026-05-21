import React, { useState } from 'react';
import {
    LayoutDashboard, Users, Utensils, ShoppingBag,
    Ticket, BarChart3, LogOut, Menu, X, Bell,
    Search, ChevronRight, Settings, Shield
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/users', icon: Users, label: 'Users' },
    { path: '/admin/restaurants', icon: Utensils, label: 'Restaurants' },
    { path: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
    { path: '/admin/coupons', icon: Ticket, label: 'Coupons' },
    { path: '/admin/reports', icon: BarChart3, label: 'Reports' },
];

const AdminLayout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, user } = useAuth();

    const userInfo = user || JSON.parse(localStorage.getItem('userInfo') || '{}');

    const handleLogout = () => {
        if (logout) logout();
        else localStorage.removeItem('userInfo');
        navigate('/login');
    };

    const isActive = (item) => {
        if (item.exact) return location.pathname === item.path;
        return location.pathname.startsWith(item.path);
    };

    const SidebarContent = () => (
        <div className="flex flex-col h-full bg-white dark:bg-slate-900">
            {/* Logo */}
            <div className={`flex items-center gap-3 p-8 border-b border-slate-50 dark:border-slate-800 ${!isSidebarOpen ? 'justify-center' : ''}`}>
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-slate-900/10 transition-all hover:scale-110">
                    <Shield size={24} className="text-white" />
                </div>
                {isSidebarOpen && (
                    <div className="min-w-0">
                        <p className="text-slate-900 dark:text-white font-black text-lg tracking-tighter leading-none uppercase italic">Spice <span className="text-primary not-italic">HUB</span></p>
                        <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mt-1 italic">Admin Core</p>
                    </div>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 px-4 py-8 space-y-1.5 overflow-y-auto">
                {menuItems.map((item) => {
                    const active = isActive(item);
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            onClick={() => setIsMobileSidebarOpen(false)}
                            className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group relative font-black uppercase text-[10px] tracking-widest ${
                                active
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]'
                                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            } ${!isSidebarOpen ? 'justify-center' : ''}`}
                        >
                            <Icon size={18} className="shrink-0" />
                            {isSidebarOpen && (
                                <>
                                    <span className="flex-1">{item.label}</span>
                                    {active && <ChevronRight size={14} className="opacity-60" />}
                                </>
                            )}
                            {!isSidebarOpen && (
                                <div className="absolute left-full ml-4 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-4 py-2 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 shadow-2xl">
                                    {item.label}
                                </div>
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User & Logout */}
            <div className="p-4 border-t border-slate-50 dark:border-slate-800">
                {isSidebarOpen && (
                    <div className="flex items-center gap-4 px-5 py-4 mb-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-sm shrink-0 border-2 border-white shadow-sm">
                            {userInfo?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-slate-900 dark:text-white text-xs font-black truncate uppercase">{userInfo?.name}</p>
                            <p className="text-primary text-[9px] font-black uppercase tracking-widest leading-none mt-1">Superuser</p>
                        </div>
                    </div>
                )}
                <button
                    onClick={handleLogout}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all font-black uppercase text-[10px] tracking-widest ${!isSidebarOpen ? 'justify-center' : ''}`}
                >
                    <LogOut size={18} className="shrink-0" />
                    {isSidebarOpen && <span>Exit Portal</span>}
                </button>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 flex">
            {/* Mobile Overlay */}
            <AnimatePresence>
                {isMobileSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[60] lg:hidden"
                        onClick={() => setIsMobileSidebarOpen(false)}
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-80 bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 z-[70] lg:hidden transform transition-transform duration-500 ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <SidebarContent />
            </aside>

            {/* Desktop Sidebar */}
            <aside className={`${isSidebarOpen ? 'w-80' : 'w-24'} bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex-col fixed inset-y-0 left-0 transition-all duration-500 hidden lg:flex z-50 shadow-sm`}>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className={`flex-1 ${isSidebarOpen ? 'lg:ml-80' : 'lg:ml-24'} transition-all duration-500 flex flex-col min-h-screen relative`}>
                {/* Top Header */}
                <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-2xl border-b border-slate-100 dark:border-slate-800 px-8 py-5">
                    <div className="flex items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            {/* Mobile menu button */}
                            <button
                                onClick={() => setIsMobileSidebarOpen(true)}
                                className="p-3 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all lg:hidden border border-slate-100 dark:border-slate-800 shadow-sm"
                            >
                                <Menu size={20} />
                            </button>
                            {/* Desktop toggle */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="p-3 rounded-xl text-slate-400 hover:text-primary hover:bg-slate-50 dark:hover:bg-slate-800 transition-all hidden lg:flex border border-slate-100 dark:border-slate-800 shadow-sm"
                            >
                                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                            </button>

                            {/* Breadcrumb */}
                            <div className="hidden sm:flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
                                <span className="text-slate-400 italic">Command</span>
                                <ChevronRight size={14} className="text-slate-300" />
                                <span className="text-slate-900 dark:text-white italic">
                                    {location.pathname === '/admin' ? 'Strategic Overview' : location.pathname.split('/admin/')[1]?.replace('-', ' ') || 'Strategic Overview'}
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="relative hidden md:block">
                                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="text"
                                    placeholder="COMMAND SEARCH..."
                                    className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl pl-12 pr-6 py-3.5 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white placeholder:text-slate-300 outline-none focus:ring-2 focus:ring-primary/10 w-64 transition-all"
                                />
                            </div>
                            <button className="relative p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 text-slate-400 hover:text-primary transition-all shadow-sm">
                                <Bell size={20} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-950" />
                            </button>
                            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-slate-900/10">
                                {userInfo?.name?.charAt(0)?.toUpperCase()}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-8 lg:p-12 relative">
                   <div className="max-w-7xl mx-auto">
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            {children}
                        </motion.div>
                   </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
