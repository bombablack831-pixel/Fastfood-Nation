import React, { useState, useEffect } from 'react';
import { 
    Zap, 
    Check, 
    ShieldCheck, 
    Clock, 
    Crown, 
    Flame,
    ArrowRight,
    Star
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import CustomerLayout from '../layouts/CustomerLayout';

const Fastpass = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchProfile = async () => {
        try {
            const { data } = await api.get('/auth/profile');
            // We need isVIP and walletBalance which aren't in basic profile usually
            // but I'll use the wallet endpoint or update profile endpoint
            const walletRes = await api.get('/wallet');
            setUser({ ...data, ...walletRes.data });
        } catch (error) {
            toast.error('Failed to load status');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    const handleSubscribe = async () => {
        setIsProcessing(true);
        try {
            await api.post('/wallet/buy-vip');
            toast.success('Welcome to Fastpass Gold! 🏆');
            fetchProfile();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Subscription failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

    const isActive = user?.isVIP && new Date(user?.vipExpiry) > new Date();

    const benefits = [
        { title: 'Zero Delivery Fee', desc: 'No delivery charges on all orders above ₹199', icon: <Zap className="text-yellow-400" fill="currentColor" /> },
        { title: 'Priority Support', desc: 'Jump the queue with dedicated customer care', icon: <ShieldCheck className="text-emerald-500" /> },
        { title: 'Exclusive Offers', desc: 'Access to "VIP Only" discounts and flash sales', icon: <Flame className="text-orange-500" fill="currentColor" /> },
        { title: 'Faster Delivery', desc: 'Your orders get picked up first by delivery partners', icon: <Clock className="text-blue-500" /> }
    ];

    return (
        <CustomerLayout>
            {/* Hero section */}
            <div className="text-center mb-16">
                <motion.div
                    initial={{ scale: 0, rotate: -45 }}
                    animate={{ scale: 1, rotate: 0 }}
                    className="w-24 h-24 bg-gradient-to-br from-yellow-300 via-orange-500 to-rose-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-orange-500/20 mx-auto mb-8 border-4 border-white/20"
                >
                    <Crown size={48} className="text-white drop-shadow-lg" fill="currentColor" />
                </motion.div>
                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter uppercase italic leading-none">FastPass <span className="text-primary">Gold</span></h1>
                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.4em] max-w-lg mx-auto leading-relaxed">
                    The ultimate dining protocol. Transcend delivery fees & achieve priority fulfillment.
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-5 gap-16 items-start">
                
                {/* Benefits List */}
                <div className="lg:col-span-3 space-y-12">
                    <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-10 flex items-center gap-4">
                        Elite Privileges <Star size={24} className="text-primary" fill="currentColor" />
                    </h2>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {benefits.map((benefit, idx) => (
                            <motion.div 
                                key={idx}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/20 transition-all group"
                            >
                                <div className="w-16 h-16 rounded-[1.25rem] bg-slate-50 dark:bg-slate-900 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <h3 className="font-black text-slate-900 dark:text-white mb-2 uppercase text-xs tracking-widest italic">{benefit.title}</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-[10px] font-bold uppercase tracking-tight leading-relaxed">{benefit.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Pricing Card */}
                <div className="lg:col-span-2">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-800 rounded-[3.5rem] border border-slate-100 dark:border-slate-700 overflow-hidden shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)] dark:shadow-none sticky top-24"
                    >
                        <div className="p-10 border-b border-slate-50 dark:border-slate-700/50">
                            {isActive ? (
                                <div className="mb-10">
                                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl text-[9px] font-black uppercase tracking-widest mb-6">
                                        <Check size={14} strokeWidth={4} /> Network Active
                                    </div>
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Gold Node</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2 italic">Expiry: {new Date(user?.vipExpiry).toLocaleDateString()}</p>
                                </div>
                            ) : (
                                <div className="mb-10">
                                    <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic mb-2">Protocol <br/>Selection</h3>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest italic">Instant activation. Global reach.</p>
                                </div>
                            )}

                            <div className="flex items-baseline gap-3 mb-10">
                                <span className="text-6xl font-black text-slate-900 dark:text-white italic tracking-tighter">₹149</span>
                                <span className="text-slate-400 font-black uppercase tracking-[0.2em] text-[9px] italic">/ Multi-cycle</span>
                            </div>

                            <ul className="space-y-6 mb-12">
                                <li className="flex items-start gap-4 text-[10px] font-black tracking-widest uppercase text-slate-600 dark:text-slate-300">
                                    <div className="mt-1"><Check className="text-primary" size={16} strokeWidth={4} /></div>
                                    Infinite Logistics (0 Fee)
                                </li>
                                <li className="flex items-start gap-4 text-[10px] font-black tracking-widest uppercase text-slate-600 dark:text-slate-300">
                                    <div className="mt-1"><Check className="text-primary" size={16} strokeWidth={4} /></div>
                                    Yield Boost (+20% Rewards)
                                </li>
                                <li className="flex items-start gap-4 text-[10px] font-black tracking-widest uppercase text-slate-600 dark:text-slate-300">
                                    <div className="mt-1"><Check className="text-primary" size={16} strokeWidth={4} /></div>
                                    Priority Data Streaming
                                </li>
                            </ul>

                            <button 
                                onClick={handleSubscribe}
                                disabled={isProcessing}
                                className={`w-full py-6 rounded-2xl font-black uppercase tracking-widest text-xs transition-all shadow-xl flex items-center justify-center gap-3 ${isActive ? 'bg-slate-50 dark:bg-slate-900 text-slate-300 dark:text-slate-700 cursor-not-allowed shadow-none border border-slate-200 dark:border-slate-800' : 'bg-primary text-white hover:opacity-95 shadow-[0_20px_40px_-10px_rgba(244,63,94,0.4)] active:scale-95'}`}
                            >
                                {isProcessing ? 'SYNCHRONIZING' : isActive ? 'ACCESS GRANTED' : 'INITIALIZE GOLD'} <ArrowRight size={20} strokeWidth={3} />
                            </button>
                            
                            <p className="text-[9px] text-center text-slate-400 font-black tracking-widest uppercase mt-8 leading-relaxed">
                                Wallet Deduct Protocol Enabled. <br/>
                                <button onClick={() => navigate('/wallet')} className="text-primary hover:underline mt-1">Refuel Wallet</button>
                            </p>
                        </div>
                        
                        <div className="p-8 bg-slate-50 dark:bg-slate-900/40 flex items-center justify-between border-t border-slate-100 dark:border-slate-700/50">
                            <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] italic">Current Liquidity</span>
                            <span className="text-xl font-black text-slate-900 dark:text-white italic tracking-tighter">₹{user?.balance || 0}</span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </CustomerLayout>
    );
};

export default Fastpass;
