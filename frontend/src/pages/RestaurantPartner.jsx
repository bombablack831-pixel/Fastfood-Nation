import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
    Utensils, CheckCircle, ArrowRight, ShieldCheck, Store, MapPin,
    BarChart3, Globe, Zap, Clock, Star, Mail, User, Lock, Eye, EyeOff, Shield
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
  restaurantName: z.string().min(2, 'Restaurant name is required'),
  restaurantAddress: z.string().min(5, 'Full address is required'),
});

const RestaurantPartner = () => {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [showPassword, setShowPassword] = useState(false);

    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(schema),
    });

    const onSubmit = async (formData) => {
        try {
            const submissionData = { ...formData, role: 'owner' };
            const { data } = await api.post('/auth/register', submissionData);
            login(data);
            toast.success('Welcome to the Family, Partner! 👨‍🍳');
            navigate('/dashboard');
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
                        <span className="font-black text-2xl uppercase tracking-tighter italic">Spice <span className="text-primary not-italic">Hub</span></span>
                    </Link>
                    <div className="flex items-center gap-8">
                        <Link to="/login" className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">Partner Login</Link>
                        <button className="bg-slate-900 text-white px-6 py-2.5 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg shadow-slate-900/10">Support</button>
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
                        <Star size={12} fill="currentColor" /> Global Partner Network
                    </motion.div>

                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-7xl font-black uppercase leading-[0.9] tracking-tighter mb-8 italic"
                    >
                        Scale Your <br/>
                        <span className="text-primary not-italic text-8xl">Kitchen</span> <br/>
                        Empire.
                    </motion.h1>

                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-slate-500 text-lg font-medium max-w-md mb-12 italic leading-relaxed"
                    >
                        "Join thousands of elite kitchens leveraging Spice Hub's precision logistics to dominate the modern food landscape."
                    </motion.p>

                    <div className="space-y-10">
                        {[
                            { icon: <BarChart3 className="text-primary" />, title: "3x Revenue Velocity", desc: "Our partners see an average 300% increase in digital sales within 6 months." },
                            { icon: <Zap className="text-orange-500" />, title: "Lightning Logistics", desc: "Average delivery time of 22 minutes ensures your food stays fresh and hot." },
                            { icon: <ShieldCheck className="text-slate-900" />, title: "Tier-1 Security", desc: "Surgical precision in payment handling and fraud protection." }
                        ].map((benefit, idx) => (
                            <motion.div 
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3 + (idx * 0.1) }}
                                key={idx} 
                                className="flex gap-6 group"
                            >
                                <div className="w-14 h-14 bg-white border border-slate-100 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-xl shadow-slate-200/50 group-hover:scale-110 transition-transform">
                                    {benefit.icon}
                                </div>
                                <div>
                                    <h3 className="font-black uppercase text-[10px] tracking-widest mb-1 italic text-slate-400 group-hover:text-slate-900 transition-colors">{benefit.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-sm">{benefit.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Form Section */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border border-slate-100 p-12 md:p-16 rounded-[4rem] shadow-2xl relative overflow-hidden shadow-slate-200/50"
                >
                    <div className="relative z-10">
                        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2 italic">Partner <span className="text-primary not-italic">Onboarding</span></h2>
                        <div className="w-14 h-2 bg-primary rounded-full mb-12" />

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Owner Identity</label>
                                    <div className="relative group">
                                        <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            {...register('name')}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-6 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                            placeholder="FULL LEGAL NAME"
                                        />
                                    </div>
                                    {errors.name && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.name.message}</p>}
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Executive Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                        <input 
                                            {...register('email')}
                                            className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-6 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                            placeholder="BIZ@DOMAIN.COM"
                                        />
                                    </div>
                                    {errors.email && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.email.message}</p>}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Kitchen Entity Name</label>
                                <div className="relative group">
                                    <Store className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input 
                                        {...register('restaurantName')}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-6 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                        placeholder="EX: THE NOBLE KITCHEN"
                                    />
                                </div>
                                {errors.restaurantName && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.restaurantName.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Physical Coordinates (Address)</label>
                                <div className="relative group">
                                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={18} />
                                    <input 
                                        {...register('restaurantAddress')}
                                        className="w-full bg-slate-50 border-2 border-transparent rounded-3xl pl-16 pr-6 py-5 text-xs font-black placeholder:text-slate-200 focus:border-primary/10 focus:bg-white outline-none transition-all"
                                        placeholder="STREET, CITY, ZIP"
                                    />
                                </div>
                                {errors.restaurantAddress && <p className="text-primary text-[9px] font-black mt-1 uppercase pl-4">{errors.restaurantAddress.message}</p>}
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest pl-1">Access Credential</label>
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
                                        <span>Initialize Partnership</span>
                                    </>
                                )}
                            </button>
                        </form>

                        <p className="mt-10 text-[10px] text-slate-400 text-center font-black leading-relaxed tracking-widest uppercase italic">
                            By proceeding, you agree to the <br/> 
                            <span className="text-slate-900 hover:text-primary cursor-pointer transition-colors underline decoration-slate-100">Merchant Master Accord</span>
                        </p>
                    </div>
                </motion.div>
            </main>
        </div>
    );
};

export default RestaurantPartner;
