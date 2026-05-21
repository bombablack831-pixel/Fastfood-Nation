import React from 'react';
import { useCart } from '../context/CartContext';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, ArrowRight, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingCart = () => {
    const { cartItems, totalAmount } = useCart();
    const location = useLocation();

    const isCartPage = location.pathname === '/cart';
    const showCart = cartItems.length > 0 && !isCartPage;

    const deliveryFee = totalAmount > 500 ? 0 : 40;
    const platformFee = 19;
    const gst = Math.round(totalAmount * 0.05);
    const estimatedTotal = totalAmount + deliveryFee + platformFee + gst;

    return (
        <AnimatePresence>
            {showCart && (
                <motion.div
                    initial={{ y: 150, opacity: 0, scale: 0.9 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    exit={{ y: 150, opacity: 0, scale: 0.9 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                    className="fixed bottom-28 right-4 left-4 md:left-auto md:right-8 z-[450] max-w-md md:ml-auto"
                >
                    <Link to="/cart">
                        <motion.div
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-3xl rounded-[2.5rem] border border-white dark:border-white/10 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.3)] dark:shadow-none overflow-hidden"
                        >
                            {/* Tactical Progress Bar */}
                            <div className="relative h-1 w-full bg-slate-100 dark:bg-white/5 overflow-hidden">
                                <motion.div
                                    className="absolute inset-y-0 left-0 bg-primary"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${Math.min((totalAmount / 500) * 100, 100)}%` }}
                                    transition={{ duration: 1, ease: "easeOut" }}
                                />
                                {totalAmount > 500 && (
                                    <motion.div 
                                        className="absolute inset-0 bg-emerald-500/20 animate-pulse"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                    />
                                )}
                            </div>

                            <div className="p-4 md:p-6 space-y-4">
                                <div className="flex justify-between items-center">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-lg shadow-primary/30">
                                            <ShoppingBag size={24} strokeWidth={2.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-1 italic">Active Payload</p>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic uppercase">
                                                {cartItems.length} <span className="text-primary not-italic">Items</span>
                                            </h3>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mb-1 italic">Est. Total</p>
                                        <p className="text-xl font-black text-slate-900 dark:text-white tracking-tighter leading-none italic">₹{estimatedTotal}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        {totalAmount <= 500 ? (
                                            <div className="bg-slate-50 dark:bg-white/5 rounded-2xl px-4 py-2 flex items-center gap-2">
                                                <Target size={12} className="text-primary animate-pulse" />
                                                <span className="text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest leading-none">
                                                    Add ₹{500 - totalAmount} for <span className="text-primary">Free Logistics</span>
                                                </span>
                                            </div>
                                        ) : (
                                            <div className="bg-emerald-500/10 rounded-2xl px-4 py-2 flex items-center gap-2">
                                                <Zap size={12} fill="currentColor" className="text-emerald-500" />
                                                <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest leading-none">
                                                    High-Speed Free Logistics Active
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="bg-slate-900 dark:bg-primary text-white p-4 rounded-2xl shadow-xl shadow-slate-900/20 group hover:bg-primary transition-all">
                                        <ArrowRight size={20} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default FloatingCart;
