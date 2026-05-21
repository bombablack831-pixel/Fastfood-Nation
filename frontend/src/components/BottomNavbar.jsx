import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingCart, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const BottomNavbar = () => {
    const location = useLocation();
    const { cartItems } = useCart();

    const navItems = [
        { icon: Home, label: 'Home', path: '/' },
        { icon: Search, label: 'Explore', path: '/restaurants' },
        { icon: ShoppingCart, label: 'Cart', path: '/cart', badge: cartItems.length },
        { icon: Package, label: 'Orders', path: '/orders' },
        { icon: User, label: 'Profile', path: '/addresses' },
    ];

    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-2xl border-t border-slate-100 px-2 py-3 z-[100] pb-safe-area">
            <div className="flex items-center justify-around max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    const Icon = item.icon;

                    return (
                        <Link 
                            key={item.path} 
                            to={item.path}
                            className="relative flex flex-col items-center gap-1 group"
                        >
                            <div className={`relative p-2 rounded-2xl transition-all duration-300 ${
                                isActive ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20' : 'text-slate-400 group-hover:text-slate-600'
                            }`}>
                                <Icon size={20} strokeWidth={isActive ? 3 : 2} />
                                {item.badge > 0 && (
                                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF4B3A] text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-white">
                                        {item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[9px] font-black uppercase tracking-widest transition-all ${
                                isActive ? 'text-orange-500 scale-100 opacity-100' : 'text-slate-400 scale-90 opacity-0 group-hover:opacity-100'
                            }`}>
                                {item.label}
                            </span>
                            {isActive && (
                                <motion.div 
                                    layoutId="bottomNav"
                                    className="absolute -bottom-1 w-1 h-1 bg-orange-500 rounded-full"
                                />
                            )}
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default BottomNavbar;
