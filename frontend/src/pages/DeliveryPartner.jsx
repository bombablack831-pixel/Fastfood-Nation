import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Bike, Wallet, IndianRupee, MapPin, 
    Smartphone, Zap, CheckCircle, Shield, 
    User, Mail, Lock, Eye, EyeOff, Navigation, Clock, Activity, Star, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email required'),
  password: z.string().min(6, 'Min 6 characters'),
});

const DeliveryPartner = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (formData) => {
        try {
            const submissionData = { ...formData, role: 'delivery' };
            const { data } = await api.post('/auth/register', submissionData);
            login(data);
            toast.success('Onboarding Successful! 🏍️');
            navigate('/delivery');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-primary/30 overflow-x-hidden">
            {/* Nav */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-2xl border-b border-slate-100 px-8 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <Link to="/" className="group flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg group-hover:bg-primary transition-all">
                            <span className="text-white font-black italic">SH</span>
                        </div>
                        <span className="font-black text-2xl uppercase tracking-tighter italic text-slate-900">Fleet <span className="text-primary not-italic">Hub</span></span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Pilot Login</Link>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-900/10">Fleet Support</button>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto px-6 pt-40 pb-20 grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                
                {/* Visual Section */}
                <div className="lg:sticky lg:top-40">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full text-primary text-[10px] font-black uppercase tracking-widest mb-8 italic"
                    >
                        <Activity size={12} /> Active Network Node
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8 italic"
                    >
                        Master Your <br/>
                        <span className="text-primary not-italic text-8xl">Earnings</span> <br/>
                        On Wheels.
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-md mb-12 italic leading-relaxed"
                    >
                        "Join the world's most advanced delivery grid. Instant payouts, smart routing, and total tactical freedom."
                    </motion.p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
                        {[
                            { icon: <Wallet className="text-primary" />, label: "Target Earnings", value: "₹45k+", sub: "Monthly potential" },
                            { icon: <Zap className="text-orange-500" />, label: "Flexibility", value: "Tactical", sub: "Own your hours" },
                            { icon: <Shield className="text-slate-900" />, label: "Protection", value: "₹5L Cover", sub: "Family insurance" }
                        ].map((s, i) => (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3 + (i * 0.1) }}
                                key={i} 
                                className="bg-white border border-slate-100 p-6 rounded-[2rem] group hover:border-primary/20 transition-all shadow-xl shadow-slate-200/40"
                            >
                                <div className="mb-4 group-hover:scale-110 transition-transform">{s.icon}</div>
                                <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 italic">{s.label}</h4>
                                <p className="text-xl font-black italic text-slate-900 leading-tight">{s.value}</p>
                                <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mt-1">{s.sub}</p>
                            </motion.div>
                        ))}
                    </div>

                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="flex items-center gap-10 opacity-20"
                    >
                        <div className="h-0.5 flex-1 bg-slate-900/50" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Active Fleet In 42 Zones</span>
                        <div className="h-0.5 flex-1 bg-slate-900/50" />
                    </motion.div>
                </div>

                {/* Form Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-100 p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden shadow-slate-200/50"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Pilot <span className="text-primary not-italic">Activation</span></h2>
                        <div className="w-14 h-2 bg-primary rounded-full mb-12" />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Identity Display</label>
                                <div className="relative group">
                                    <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input 
                                        {...register('name')}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-6 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                        placeholder="EX: JOHN MAVERICK"
                                    />
                                </div>
                                {errors.name && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.name.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Comm-Link (Email)</label>
                                <div className="relative group">
                                    <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input 
                                        {...register('email')}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-6 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                        placeholder="PILOT@FLEET-HUB.COM"
                                    />
                                </div>
                                {errors.email && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.email.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Secure Encryption Key</label>
                                <div className="relative group">
                                    <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input 
                                        type={showPassword ? 'text' : 'password'}
                                        {...register('password')}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-16 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                        placeholder="MIN 6 CHARACTERS"
                                    />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-300 hover:text-primary transition-colors">
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.password && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.password.message}</p>}
                            </div>

                            <button 
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-slate-900 hover:bg-primary text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl shadow-slate-900/10 hover:shadow-primary/30 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-4 mt-8"
                            >
                                {isSubmitting ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Zap size={18} fill="currentColor" />
                                        <span>Initialize Rider Onboarding</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-12 flex items-center justify-center gap-6">
                            <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-300">
                                <Smartphone size={18} />
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-[0.2em] italic text-slate-400">Fleet App Ready for Sync</span>
                        </div>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default DeliveryPartner;
