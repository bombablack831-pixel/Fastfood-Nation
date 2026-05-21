import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import api from '../utils/api';
import { 
    LayoutDashboard, 
    Utensils, 
    ShoppingBag, 
    BarChart3, 
    LogOut,
    Bell,
    Users,
    DollarSign,
    MoreHorizontal
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const RestaurantLayout = ({ children }) => {
    const location = useLocation();
    const { logout, user } = useAuth();
    const [restaurantName, setRestaurantName] = React.useState('Spice Hub');

    React.useEffect(() => {
        const fetchRestaurant = async () => {
            try {
                const { data } = await api.get('/restaurants/owner/me');
                if (data.name) setRestaurantName(data.name);
            } catch (err) {
                console.error('Failed to fetch restaurant name:', err);
            }
        };
        if (user && (user.role === 'owner' || user.role === 'restaurantOwner')) {
            fetchRestaurant();
        }
    }, [user]);

    const menuItems = [
        { label: 'Overview',  icon: <LayoutDashboard size={20} />, path: '/dashboard' },
        { label: 'Orders',    icon: <ShoppingBag size={20} />,     path: '/dashboard/orders' },
        { label: 'Menu',      icon: <Utensils size={20} />,        path: '/dashboard/menu' },
        { label: 'Earnings',  icon: <DollarSign size={20} />,      path: '/dashboard/earnings' },
        { label: 'Riders',    icon: <Users size={20} />,           path: '/dashboard/riders' },
        { label: 'Analytics', icon: <BarChart3 size={20} />,       path: '/dashboard/analytics' },
        { label: 'Settings',  icon: <MoreHorizontal size={20} />,   path: '/dashboard/settings' },
    ];

    const bottomTabs = [
        { label: 'Orders',    icon: <ShoppingBag size={22} />,   path: '/dashboard/orders' },
        { label: 'Menu',      icon: <Utensils size={22} />,       path: '/dashboard/menu' },
        { label: 'Earnings',  icon: <DollarSign size={22} />,    path: '/dashboard/earnings' },
        { label: 'Settings',  icon: <MoreHorizontal size={22} />, path: '/dashboard/settings' },
    ];

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex">
            {/* Sidebar (Desktop) */}
            <aside className="w-80 border-r border-slate-200 bg-white p-8 flex flex-col fixed h-full hidden lg:flex">
                <div className="flex items-center gap-4 mb-12">
                    <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                        <Utensils className="text-white" size={24} />
                    </div>
                    <div className="min-w-0">
                        <h2 className="font-black text-xl leading-none tracking-tight truncate">{restaurantName}</h2>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Management Portal</p>
                    </div>
                </div>

                <nav className="space-y-2 flex-grow">
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group font-black uppercase text-[10px] tracking-widest ${
                                location.pathname === item.path 
                                ? 'bg-primary text-white shadow-xl shadow-primary/20' 
                                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
                            }`}
                        >
                            {item.icon}
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="mt-8 pt-8 border-t border-slate-100 space-y-4">
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-slate-400 hover:text-primary hover:bg-primary/5 transition-all font-black uppercase text-[10px] tracking-widest"
                    >
                        <LogOut size={20} /> Logout
                    </button>
                    
                    <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full overflow-hidden shrink-0 border-2 border-white shadow-sm bg-white flex items-center justify-center">
                            {user?.profilePicture ? (
                                <img src={user.profilePicture} className="w-full h-full object-cover" alt="User" />
                            ) : (
                                <span className="text-sm font-black text-slate-400">{user?.name?.charAt(0) || 'O'}</span>
                            )}
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Owner</p>
                            <p className="font-black truncate text-sm">{user?.name}</p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 lg:ml-80 min-h-screen overflow-y-auto">
                <header className="lg:hidden p-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-xl z-50">
                    <div className="flex items-center gap-3">
                         <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white">
                            <Utensils size={18} />
                         </div>
                         <span className="font-black tracking-tight text-sm truncate max-w-[150px]">{restaurantName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="w-9 h-9 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                            <Bell size={17} />
                        </button>
                        <div className="w-9 h-9 rounded-full overflow-hidden border border-slate-200 bg-white flex items-center justify-center">
                             {user?.profilePicture ? (
                                 <img src={user.profilePicture} className="w-full h-full object-cover" alt="User" />
                             ) : (
                                 <span className="text-xs font-black text-slate-400">{user?.name?.charAt(0) || 'O'}</span>
                             )}
                        </div>
                    </div>
                </header>

                <div className="p-4 lg:p-12 pb-24 lg:pb-12">
                    {children}
                </div>
            </main>

            {/* Mobile Bottom Tab Bar (Matching "Restaurant View" in image) */}
            <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white border-t border-slate-100 shadow-2xl">
                <div className="flex items-center justify-around px-2 py-3">
                    {bottomTabs.map((tab) => {
                        const isActive = location.pathname === tab.path;
                        return (
                            <Link
                                key={tab.path}
                                to={tab.path}
                                className="flex flex-col items-center gap-1 py-1 flex-1 relative"
                            >
                                <div className={`transition-all duration-300 ${isActive ? 'text-primary scale-110' : 'text-slate-400'}`}>
                                    {tab.icon}
                                </div>
                                <span className={`text-[9px] font-black uppercase tracking-tighter transition-colors ${isActive ? 'text-primary' : 'text-slate-400'}`}>
                                    {tab.label}
                                </span>
                                {isActive && (
                                    <motion.div layoutId="bottomTabDot" className="absolute -top-3 w-1 h-1 rounded-full bg-primary" />
                                )}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
};

export default RestaurantLayout;

