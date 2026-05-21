import React from 'react';
import { Mail, Phone, MapPin, MessageSquare, Send, Zap, Globe, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-950 pb-24">
            {/* Hero Section */}
            <div className="relative h-96 flex items-center justify-center overflow-hidden rounded-[4rem] mb-16 mx-4 mt-4">
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1423666639041-f56000c27a9a?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/60 to-slate-900" />
                </div>
                
                <div className="relative text-center space-y-6 px-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary/20 backdrop-blur-md rounded-full border border-primary/30"
                    >
                        <Zap size={14} className="text-primary" />
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Support Sector 7</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl font-black text-white uppercase italic tracking-tighter">
                        GET IN <span className="text-primary">TOUCH</span>
                    </h1>
                    <p className="text-slate-400 max-w-xl mx-auto text-sm font-medium">
                        Our support pilots are standing by to assist with your mission. 
                        Whether it's an order query or a tactical partnership, we've got you covered.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 max-w-7xl">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-slate-50 dark:bg-slate-900/50 p-10 rounded-[3rem] border border-slate-100 dark:border-white/5 space-y-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Mission Control</h3>
                            
                            <div className="space-y-8">
                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-xl border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                                        <Phone size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voice Line</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">+91 98765 43210</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-xl border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                                        <Mail size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Transmission</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">support@spicehub.io</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-6 group">
                                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl flex items-center justify-center text-primary shadow-xl border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Base Coordinates</p>
                                        <p className="text-lg font-black text-slate-900 dark:text-white">Kanodar Hub, Palanpur Hwy</p>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-8 border-t border-slate-200 dark:border-white/5 flex items-center gap-4">
                                <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                    <Globe size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                    <Github size={18} />
                                </button>
                                <button className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary transition-colors">
                                    <MessageSquare size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white dark:bg-slate-900 p-10 md:p-16 rounded-[4rem] border border-slate-100 dark:border-white/5 shadow-2xl space-y-12">
                            <div className="space-y-4">
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Send Transmission</h3>
                                <p className="text-slate-400 text-sm font-medium">Ready to deploy a message? Fill out the form below and we'll get back to you faster than a delivery rider on nitro. 🚀</p>
                            </div>

                            <form className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Pilot Name</label>
                                        <input 
                                            type="text" 
                                            placeholder="YOUR NAME"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-3xl px-8 py-5 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Email Address</label>
                                        <input 
                                            type="email" 
                                            placeholder="YOUR EMAIL"
                                            className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-3xl px-8 py-5 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Message Content</label>
                                    <textarea 
                                        rows="6"
                                        placeholder="WHAT'S ON YOUR MIND?"
                                        className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-white/5 rounded-[2.5rem] px-8 py-6 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-primary/10 transition-all outline-none resize-none"
                                    ></textarea>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full md:w-auto px-12 py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-primary/30 hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-4"
                                >
                                    <Send size={18} />
                                    Submit Transmission
                                </button>
                            </form>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactPage;
