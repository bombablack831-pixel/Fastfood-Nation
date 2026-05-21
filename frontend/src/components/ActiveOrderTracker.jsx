import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Zap, Navigation, Package, ArrowRight, 
    ChefHat, Bike, ShoppingBag, Shield 
} from 'lucide-react';
import api from '../utils/api';
import { io } from 'socket.io-client';

const SOCKET_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000' : `http://${window.location.hostname}:5000`;

const ActiveOrderTracker = () => {
    const [activeOrder, setActiveOrder] = useState(null);
    const [status, setStatus] = useState('');
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));

    useEffect(() => {
        if (!userInfo) return;

        const fetchActiveOrder = async () => {
            try {
                const { data } = await api.get('/orders/last');
                if (data && data.status !== 'delivered' && data.status !== 'cancelled') {
                    setActiveOrder(data);
                    setStatus(data.status);
                    
                    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
                    socket.emit('join_order', data._id);
                    socket.on('status_update', (update) => {
                        setStatus(typeof update === 'string' ? update : update.status);
                    });

                    return () => socket.disconnect();
                }
            } catch (err) {
                console.error('Failed to fetch active order:', err);
            }
        };

        fetchActiveOrder();
    }, []);

    if (!activeOrder) return null;

    const getStatusConfig = (s) => {
        switch(s) {
            case 'preparing': return { label: 'Chef is Preparing', icon: <ChefHat size={18} />, color: 'text-orange-500', bg: 'bg-orange-500/10' };
            case 'picked_up':
            case 'out_for_delivery': return { label: 'Pilot in Transit', icon: <Bike size={18} />, color: 'text-primary', bg: 'bg-primary/10' };
            default: return { label: 'Order Confirmed', icon: <Package size={18} />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
        }
    };

    const config = getStatusConfig(status);

    return (
        <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-32 left-6 right-6 lg:left-auto lg:right-12 z-40 max-w-sm w-full"
        >
            <Link to={`/track/${activeOrder._id}`} className="block">
                <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl border-2 border-slate-100 dark:border-white/10 rounded-[2.5rem] p-6 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] hover:border-primary/30 transition-all group overflow-hidden relative">
                    {/* Decorative Background */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl rounded-full -mr-16 -mt-16" />
                    
                    <div className="flex items-center justify-between mb-5">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-ping absolute" />
                                <div className="w-3 h-3 bg-emerald-500 rounded-full relative" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Live Deployment</span>
                        </div>
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-900 dark:bg-white rounded-full">
                            <span className="text-[9px] font-black text-white dark:text-slate-900 uppercase tracking-widest italic">#{activeOrder._id.slice(-6).toUpperCase()}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-5">
                        <div className={`w-14 h-14 ${config.bg} ${config.color} rounded-2xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform duration-500`}>
                            {config.icon}
                        </div>
                        <div className="flex-1">
                            <h4 className="text-lg font-black text-slate-900 dark:text-white italic uppercase tracking-tighter leading-none mb-1.5">{config.label}</h4>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{activeOrder.restaurant?.name}</p>
                        </div>
                        <div className="w-10 h-10 bg-slate-50 dark:bg-white/5 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all">
                            <ArrowRight size={18} />
                        </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                         <div className="flex -space-x-2">
                             {activeOrder.items.slice(0, 3).map((item, i) => (
                                 <div key={i} className="w-7 h-7 rounded-lg border-2 border-white dark:border-slate-900 bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-[8px] font-black overflow-hidden">
                                     <img 
                                         src={item.food?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'} 
                                         alt="" 
                                         className="w-full h-full object-cover" 
                                         onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop'; }}
                                     />
                                 </div>
                             ))}
                         </div>
                         <div className="flex items-center gap-2">
                             <Zap size={14} className="text-primary animate-pulse" />
                             <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest italic">Tracking Active</span>
                         </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    );
};

export default ActiveOrderTracker;
