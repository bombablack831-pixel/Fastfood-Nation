import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
    User, 
    Package, 
    Heart, 
    Wallet, 
    MapPin, 
    Bell, 
    ShieldCheck, 
    LogOut,
    ChevronRight,
    HelpCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CustomerLayout = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuth();

    const menuItems = [
        { id: 'profile', label: 'Profile', icon: <User size={20} />, path: '/profile' },
        { id: 'orders', label: 'Orders', icon: <Package size={20} />, path: '/orders' },
        { id: 'favorites', label: 'Favorites', icon: <Heart size={20} />, path: '/favorites' },
        { id: 'wallet', label: 'Wallet', icon: <Wallet size={20} />, path: '/wallet' },
        { id: 'addresses', label: 'Addresses', icon: <MapPin size={20} />, path: '/addresses' },
        { id: 'notifications', label: 'Notifications', icon: <Bell size={20} />, path: '/notifications' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300 pb-24 lg:pb-0">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col lg:flex-row gap-12">
                
                {/* Desktop Sidebar */}
                <aside className="lg:w-80 shrink-0 hidden lg:block">
                    <div className="bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden">
                        <div className="p-8 border-b border-slate-50 dark:border-slate-700 text-center">
                            <div className="w-20 h-20 bg-primary rounded-3xl mx-auto mb-4 flex items-center justify-center text-white text-3xl font-black shadow-lg shadow-primary/30">
                                {user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{user?.name}</h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{user?.email}</p>
                        </div>

                        <nav className="p-4">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.id}
                                    to={item.path}
                                    className={`flex items-center justify-between px-6 py-4 rounded-2xl transition-all group ${
                                        location.pathname === item.path 
                                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700'
                                    }`}
                                >
                                    <div className="flex items-center gap-4 font-black uppercase text-[10px] tracking-widest">
                                        {item.icon}
                                        {item.label}
                                    </div>
                                    <ChevronRight size={14} className={location.pathname === item.path ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} />
                                </Link>
                            ))}
                        </nav>

                        <div className="p-4 border-t border-slate-50 dark:border-slate-700">
                             <button 
                                onClick={logout}
                                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-rose-500 hover:bg-rose-50 hover:dark:bg-rose-500/10 transition-all font-black uppercase text-[10px] tracking-widest"
                             >
                                <LogOut size={20} /> Terminate Session
                             </button>
                        </div>
                    </div>

                    <div className="mt-8 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                        <ShieldCheck className="absolute -right-4 -bottom-4 text-white/5" size={120} />
                        <h4 className="text-lg font-black uppercase tracking-tight mb-2 italic">FastPass</h4>
                        <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest leading-relaxed mb-6">Experience zero delivery fees and priority kitchen routing.</p>
                        <Link to="/fastpass" className="inline-block bg-white text-black px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all">Join Club</Link>
                    </div>
                </aside>

                {/* Main Content Area */}
                <div className="flex-1">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomerLayout;
