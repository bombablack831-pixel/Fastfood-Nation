import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
    Navigation, Truck, History, Wallet, LogOut, Bell, BarChart3, Home,
    Smartphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const RiderLayout = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { label: 'Overview', icon: <Home size={20} />, path: '/delivery' },
        { label: 'Active Tasks', icon: <Navigation size={20} />, path: '/delivery/tasks' },
        { label: 'Earnings', icon: <Wallet size={20} />, path: '/delivery/earnings' },
        { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/delivery/analytics' },
    ];

    const bottomTabs = [
        { label: 'Home', icon: <Home size={22} />, path: '/delivery' },
        { label: 'Tasks', icon: <Navigation size={22} />, path: '/delivery/tasks' },
        { label: 'Earnings', icon: <Wallet size={22} />, path: '/delivery/earnings' },
        { label: 'Analytics', icon: <BarChart3 size={20} />, path: '/delivery/analytics' },];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-80 border-r border-slate-100 p-8 flex flex-col fixed h-full hidden lg:flex bg-white">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg shadow-slate-900/10">
                        <Truck className="text-white" size={24} />
                    </div>
                    <div>
                        <h2 className="font-black text-xl leading-none tracking-tight">Fleet Hub</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Pilot Portal</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-grow">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path + item.label}
                                to={item.path}
                                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-black uppercase text-[10px] tracking-widest ${isActive
                                    ? 'bg-primary text-white shadow-xl shadow-primary/20'
                                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                                    }`}
                            >
                                {item.icon}
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                    <button
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                        <LogOut size={20} /> Logout
                    </button>

                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active Signal</span>
                        </div>
                        <p className="font-black text-slate-900 text-sm truncate">{user?.name}</p>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-80 min-h-screen overflow-y-auto">
                <header className="lg:hidden p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                            <Truck size={18} />
                        </div>
                        <span className="font-black tracking-tight text-sm uppercase">Fleet Hub</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse mr-2" />
                        <button className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-600 border border-slate-100">
                            <Bell size={17} />
                        </button>
                    </div>
                </header>

                <div className="p-4 lg:p-12 pb-24 lg:pb-12">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Tab Bar */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-100 shadow-2xl">
                <div className="flex items-center justify-around px-2 py-3">
                    {bottomTabs.map((tab, i) => {
                        const active = tab.path === location.pathname;
                        return (
                            <Link
                                key={`${tab.path}-${i}`}
                                to={tab.path}
                                className="flex flex-col items-center gap-1 flex-1 relative py-1"
                            >
                                <div className={`transition-all duration-300 ${active ? 'text-primary scale-110' : 'text-slate-400'}`}>
                                    {tab.icon}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${active ? 'text-primary' : 'text-slate-400'}`}>
                                    {tab.label}
                                </span>
                                {active && (
                                    <motion.div layoutId="riderTabDot" className="absolute -top-3 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default RiderLayout;
