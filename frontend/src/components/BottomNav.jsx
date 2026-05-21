import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Bell, User, Zap, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import api from '../utils/api';

const BottomNav = () => {
    const { cartItems } = useCart();
    const location = useLocation();

    const [unreadCount, setUnreadCount] = React.useState(0);
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    React.useEffect(() => {
        const fetchUnread = async () => {
            if (!userInfo) return;
            try {
                const { data } = await api.get('/notifications');
                setUnreadCount(data.filter(n => n.status === 'unread').length);
            } catch (err) {}
        };
        fetchUnread();
    }, []);

    const navItems = [
        { to: '/', icon: Home, label: 'Hub' },
        { to: '/search', icon: Search, label: 'Search' },
        { to: '/notifications', icon: Bell, label: 'Alerts', badge: unreadCount },
        { to: '/cart', icon: ShoppingBag, label: 'Cart', badge: cartItems.length },
        { to: '/profile', icon: User, label: 'Pilot' },
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-[500] lg:hidden">
            {/* Ambient Glow */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-white dark:from-[#050505] to-transparent pointer-events-none" />

            {/* Main Bar Wrapper */}
            <div className="relative px-4 pb-4">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] border border-white dark:border-white/5 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden">
                    <div className="flex items-center justify-around px-2 py-1.5 relative">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.to || (item.to !== '/' && location.pathname.startsWith(item.to));
                            
                            return (
                                <NavLink
                                    key={item.to}
                                    to={item.to}
                                    className="relative flex-1 group"
                                >
                                    <div className="flex flex-col items-center gap-1 py-1.5 transition-all">
                                        {/* Active Highlight */}
                                        <AnimatePresence>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="nav-bg"
                                                    className="absolute inset-x-2 inset-y-1 bg-primary/10 rounded-2xl"
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.8 }}
                                                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                                                />
                                            )}
                                        </AnimatePresence>

                                        <div className="relative">
                                            <item.icon
                                                size={20}
                                                strokeWidth={isActive ? 3 : 2}
                                                className={`transition-all duration-500 ${
                                                    isActive 
                                                    ? 'text-primary scale-110 drop-shadow-[0_0_8px_rgba(244,63,94,0.3)]' 
                                                    : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'
                                                }`}
                                            />

                                            {/* Notification / Cart Badge */}
                                            {item.badge > 0 && (
                                                <motion.span 
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute -top-1.5 -right-1.5 min-w-[17px] h-4.5 bg-primary rounded-full text-[9px] font-black text-white flex items-center justify-center px-1 border-2 border-white dark:border-slate-900 shadow-md animate-bounce"
                                                >
                                                    {item.badge}
                                                </motion.span>
                                            )}
                                        </div>

                                        <span className={`text-[8px] font-black uppercase tracking-[0.15em] transition-all duration-500 ${
                                            isActive 
                                            ? 'text-primary scale-100 opacity-100 italic' 
                                            : 'text-slate-400 dark:text-slate-500 opacity-60'
                                        }`}>
                                            {item.label}
                                        </span>

                                        {/* Active Line */}
                                        {isActive && (
                                            <motion.div 
                                                layoutId="nav-line"
                                                className="w-4 h-0.5 bg-primary rounded-full"
                                                transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                                            />
                                        )}
                                    </div>
                                </NavLink>
                            )
                        })}
                    </div>

                    {/* Bottom Indicator */}
                    <div className="flex justify-center pb-2 pt-1 opacity-20">
                        <div className="w-16 h-1 bg-slate-300 dark:bg-white rounded-full" />
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default BottomNav;
