import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Frown, ArrowLeft, Search, Utensils } from 'lucide-react';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center px-6 overflow-hidden relative">
            {/* Ambient Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] bg-[radial-gradient(circle,rgba(124,58,237,0.05)_0%,rgba(0,0,0,0)_70%)]" />
                <div className="absolute top-0 left-0 w-full h-full opacity-5 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
            </div>

            <div className="max-w-2xl w-full text-center relative z-10">
                
                {/* Tactical Alert Icon */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-center mb-12"
                >
                    <div className="w-24 h-24 bg-violet-600/10 border border-violet-600/20 rounded-[3rem] flex items-center justify-center text-violet-500 shadow-2xl">
                        <Search size={40} strokeWidth={1.5} className="animate-pulse" />
                    </div>
                </motion.div>

                {/* Main 404 Display */}
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="relative mb-12"
                >
                    <h1 className="text-[12rem] md:text-[18rem] font-black text-white leading-none tracking-tighter mix-blend-difference selection:bg-violet-500/30">
                        404
                    </h1>
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="h-px w-full bg-violet-600/20" />
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-6 mb-12"
                >
                    <div className="flex items-center justify-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-violet-600 animate-pulse" />
                        <h2 className="text-xl md:text-2xl font-black text-white uppercase tracking-[0.2em] italic">Sector Not Found</h2>
                    </div>
                    <p className="text-slate-500 font-bold text-xs md:text-sm uppercase tracking-widest max-w-md mx-auto leading-relaxed border-t border-white/5 pt-6 italic">
                        The requested coordinates do not match any active nodes in the Fastfood Nation network. Redirect protocol required.
                    </p>
                </motion.div>

                {/* Logistics Hub Shortcuts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
                >
                    {[
                        { to: '/', label: 'Home', icon: <Home size={18} />, color: 'violet' },
                        { to: '/search', label: 'Scanner', icon: <Search size={18} />, color: 'emerald' },
                        { to: '/offers', label: 'Vault', icon: <Utensils size={18} />, color: 'orange' },
                    ].map((link) => (
                        <Link
                            key={link.label}
                            to={link.to}
                            className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 hover:border-white/20 transition-all group"
                        >
                            <span className="text-slate-500 group-hover:text-white transition-colors">
                                {link.icon}
                            </span>
                            <span className="text-[10px] font-black text-slate-400 dark:text-slate-300 uppercase tracking-widest group-hover:text-white">
                                {link.label}
                            </span>
                        </Link>
                    ))}
                </motion.div>

                {/* Fallback Command */}
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={() => navigate(-1)}
                    className="group inline-flex items-center gap-4 text-slate-600 hover:text-white transition-colors"
                >
                    <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
                    <span className="font-black text-[10px] uppercase tracking-[0.4em] italic leading-none">Execute Return Seq</span>
                </motion.button>
            </div>
        </div>
    );
};

export default NotFound;
