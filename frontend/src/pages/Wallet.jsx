import React, { useState, useEffect } from 'react';
import { 
    Wallet as WalletIcon, 
    ArrowUpRight, 
    ArrowDownLeft, 
    CreditCard, 
    History, 
    Zap, 
    Gift,
    ChevronRight,
    TrendingUp,
    RefreshCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import { toast } from 'react-toastify';
import CustomerLayout from '../layouts/CustomerLayout';

const Wallet = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [topupAmount, setTopupAmount] = useState('');
    const [isTopupModalOpen, setIsTopupModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const fetchWalletData = async () => {
        try {
            const { data } = await api.get('/wallet');
            setData(data);
        } catch (error) {
            toast.error('Failed to fetch wallet details');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWalletData();
    }, []);

    const handleTopup = async () => {
        if (!topupAmount || topupAmount <= 0) return toast.error('Enter a valid amount');
        setIsProcessing(true);
        try {
            await api.post('/wallet/topup', { amount: topupAmount });
            toast.success('Money added to wallet! 💰');
            setTopupAmount('');
            setIsTopupModalOpen(false);
            fetchWalletData();
        } catch (error) {
            toast.error('Top-up failed');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleRedeem = async () => {
        if (data?.loyaltyPoints < 100) return toast.warning('You need at least 100 points to redeem');
        setIsProcessing(true);
        try {
            await api.post('/wallet/redeem-points');
            toast.success('Points redeemed successfully! 🎉');
            fetchWalletData();
        } catch (error) {
            toast.error('Redemption failed');
        } finally {
            setIsProcessing(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <CustomerLayout>
            <header className="mb-12">
                <h1 className="text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic leading-none mb-3">FastCash <span className="text-primary flex items-center gap-2">Protocol <Zap size={28} fill="currentColor" /></span></h1>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Neural account liquidity & bonus yields</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {/* Main Balance Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:col-span-2 bg-gradient-to-br from-slate-900 via-slate-800 to-black p-10 rounded-[3.5rem] relative overflow-hidden shadow-2xl border border-white/5 group"
                >
                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
                        <WalletIcon size={180} className="text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex justify-between items-start mb-12">
                            <div>
                                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.4em] mb-3 leading-none italic">Verified Liquidity</p>
                                <h2 className="text-7xl font-black text-white italic tracking-tighter">₹{data?.balance?.toLocaleString() || 0}</h2>
                            </div>
                        </div>

                        <div className="mt-auto flex gap-6">
                            <button 
                                onClick={() => setIsTopupModalOpen(true)}
                                className="flex-1 bg-white text-black py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 shadow-xl shadow-white/5"
                            >
                                <ArrowUpRight size={20} /> Inject Capital
                            </button>
                            <button className="hidden md:flex flex-1 bg-white/5 backdrop-blur-md text-white/60 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all border border-white/5 items-center justify-center gap-2">
                                <History size={20} /> Retrieval Logs
                            </button>
                        </div>
                    </div>
                </motion.div>

                {/* Loyalty Points Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-primary p-10 rounded-[3.5rem] flex flex-col relative overflow-hidden group shadow-2xl shadow-primary/20"
                >
                    <Gift className="absolute -right-6 -bottom-6 text-white/10 group-hover:scale-110 transition-transform" size={140} />
                    
                    <div className="flex items-center gap-3 mb-10">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white">
                            <Gift size={24} />
                        </div>
                        <h3 className="font-black text-white uppercase tracking-tight italic">Yield Node</h3>
                    </div>

                    <div className="mb-10 relative z-10">
                        <h4 className="text-6xl font-black text-white italic tracking-tighter">{data?.loyaltyPoints || 0}</h4>
                        <p className="text-white/60 text-[10px] font-black uppercase tracking-widest mt-2">Points for conversion</p>
                    </div>

                    <div className="mt-auto relative z-10">
                        <button 
                            onClick={handleRedeem}
                            disabled={isProcessing || (data?.loyaltyPoints < 100)}
                            className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-xl shadow-black/20"
                        >
                            Execute Conversion
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Referral Info */}
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none flex flex-col md:flex-row items-center gap-10 mb-12"
            >
                <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center text-primary border border-primary/10">
                    <TrendingUp size={36} />
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h3 className="font-black text-slate-900 dark:text-white text-xl uppercase tracking-tight italic mb-2">Social Multiplication</h3>
                    <p className="text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-widest">Acquire ₹50 for every verified invitee deployed.</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-900 px-8 py-5 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex items-center gap-6 group hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => {
                        navigator.clipboard.writeText(data?.referralCode);
                        toast.success('Code copied!');
                    }}
                >
                    <span className="font-black text-2xl tracking-[0.2em] text-primary">{data?.referralCode}</span>
                    <RefreshCcw size={20} className="text-slate-400 group-hover:rotate-180 transition-transform duration-500" />
                </div>
            </motion.div>

            {/* Recent Transactions */}
            <section className="pb-20">
                <div className="flex justify-between items-center mb-8 px-4">
                    <div className="flex items-center gap-4">
                        <History className="text-primary" size={24} />
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight italic">Activity logs</h3>
                    </div>
                </div>

                <div className="space-y-4">
                    {data?.transactions?.length > 0 ? (
                        data.transactions.map((tx) => (
                            <div key={tx._id} className="bg-white dark:bg-slate-800 p-6 rounded-[2.5rem] border border-slate-50 dark:border-slate-700/50 flex items-center gap-6 hover:translate-x-2 transition-transform shadow-lg shadow-slate-100 dark:shadow-none">
                                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border ${tx.type === 'credit' ? 'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/10' : 'bg-rose-50 text-rose-600 border-rose-100 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/10'}`}>
                                    {tx.type === 'credit' ? <ArrowDownLeft size={24} /> : <ArrowUpRight size={24} />}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight mb-1 italic">{tx.description}</h4>
                                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{new Date(tx.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                                <div className="text-right">
                                    <div className={`text-xl font-black italic tracking-tighter ${tx.type === 'credit' ? 'text-emerald-600' : 'text-rose-600'}`}>
                                        {tx.type === 'credit' ? '+' : '-'}₹{tx.amount}
                                    </div>
                                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Verified</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-slate-800/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-700">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Temporal Void: No transactions detected</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Top-up Modal */}
            <AnimatePresence>
                {isTopupModalOpen && (
                    <div className="fixed inset-0 z-[1000] flex items-center justify-center px-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsTopupModalOpen(false)}
                            className="absolute inset-0 bg-slate-950/90 backdrop-blur-xl"
                        />
                        <motion.div 
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative bg-white dark:bg-slate-900 w-full max-w-md rounded-[3.5rem] p-10 shadow-2xl border border-white/10"
                        >
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8 italic uppercase tracking-tighter leading-none">Inject <br/><span className="text-primary">Capital</span></h2>
                            
                            <div className="space-y-8">
                                <div>
                                    <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-4 block">Deployment Amount (₹)</label>
                                    <div className="relative">
                                        <span className="absolute left-6 top-1/2 -translate-y-1/2 text-3xl font-black text-slate-400 italic">₹</span>
                                        <input 
                                            type="number" 
                                            value={topupAmount}
                                            onChange={(e) => setTopupAmount(e.target.value)}
                                            placeholder="500"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl py-6 pl-14 pr-8 text-4xl font-black text-slate-900 dark:text-white focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all italic tracking-tighter"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-4 gap-3">
                                    {[100, 500, 1000, 2000].map(amt => (
                                        <button 
                                            key={amt}
                                            onClick={() => setTopupAmount(amt)}
                                            className="bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl text-[10px] font-black text-slate-600 dark:text-slate-400 hover:bg-primary/20 hover:text-primary transition-all active:scale-95 border border-transparent hover:border-primary/20"
                                        >
                                            +₹{amt}
                                        </button>
                                    ))}
                                </div>

                                <button 
                                    onClick={handleTopup}
                                    disabled={isProcessing}
                                    className="w-full bg-primary text-white py-6 rounded-2xl font-black uppercase tracking-widest shadow-[0_20px_40px_-10px_rgba(244,63,94,0.4)] hover:shadow-[0_25px_50px_-10px_rgba(244,63,94,0.5)] active:scale-95 transition-all flex items-center justify-center gap-3"
                                >
                                    {isProcessing ? <RefreshCcw className="animate-spin" size={20} /> : <Zap size={20} fill="currentColor" />}
                                    {isProcessing ? 'SYNCHRONIZING...' : 'EXECUTE PAYMENT'}
                                </button>
                                
                                <button onClick={() => setIsTopupModalOpen(false)} className="w-full text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-600 transition-colors">Abort Mission</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </CustomerLayout>
    );
};

export default Wallet;
