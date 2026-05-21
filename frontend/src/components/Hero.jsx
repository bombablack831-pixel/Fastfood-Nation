import React from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, ArrowRight, Play, Star, Clock, Zap } from 'lucide-react';

const Hero = ({ searchQuery, setSearchQuery }) => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-white dark:bg-slate-950">
      {/* Background Animated Blobs */}
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[800px] h-[800px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[120px] -z-10" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[600px] h-[600px] bg-rose-500/5 dark:bg-rose-500/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          {/* Content Left */}
          <div className="space-y-10 relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-white/5 rounded-full border border-orange-100 dark:border-white/10"
            >
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#FF4B3A]">
                Fastest Delivery in Gujarat
              </span>
            </motion.div>

            <div className="space-y-6">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-6xl md:text-8xl font-black text-slate-900 dark:text-white leading-[0.95] tracking-tighter uppercase italic"
              >
                Delicious <span className="text-primary not-italic">Food</span> <br />
                Direct To <span className="text-slate-200 dark:text-slate-800">Your</span> <br />
                Doorstep.
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-slate-500 dark:text-slate-400 max-w-lg font-medium leading-relaxed"
              >
                Experience the premium taste from the best restaurants around you. 
                Get it delivered in less than <span className="font-black text-slate-900 dark:text-white">30 minutes.</span>
              </motion.p>
            </div>

            {/* Search & Location Controls */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch gap-4 p-3 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5"
            >
              <div className="flex-1 flex items-center gap-3 px-4 border-r border-slate-100 dark:border-white/5">
                <MapPin size={20} className="text-primary shrink-0" />
                <input 
                  type="text" 
                  placeholder="Enter location..."
                  className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full dark:text-white"
                />
              </div>
              <div className="flex-[1.5] flex items-center gap-3 px-4">
                <Search size={20} className="text-slate-400 shrink-0" />
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search restaurants or dishes..."
                  className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full dark:text-white"
                />
              </div>
              <button className="bg-primary text-white p-5 rounded-[2rem] flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-xl shadow-primary/30">
                <ArrowRight size={24} />
              </button>
            </motion.div>

            {/* Stats / Proof */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap items-center gap-8 pt-4"
            >
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-slate-200 overflow-hidden shadow-sm">
                    <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover" />
                  </div>
                ))}
                <div className="w-10 h-10 rounded-full border-4 border-white dark:border-slate-950 bg-primary flex items-center justify-center text-white text-[10px] font-black shadow-sm">
                  10K+
                </div>
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase italic tracking-wider">Happy Foodies</p>
                <div className="flex items-center gap-1">
                  {[1,2,3,4,5].map(i => <Star key={i} size={10} fill="#FFD700" color="#FFD700" />)}
                  <span className="text-[10px] font-black text-slate-400 ml-1">4.9 (12K Reviews)</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Image Right with Floating Cards */}
          <div className="relative h-[600px] hidden lg:block">
            {/* Main Image Container */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1, type: 'spring' }}
              className="relative w-full h-full bg-slate-50 dark:bg-white/5 rounded-[4rem] overflow-hidden shadow-2xl group"
            >
              <img 
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" 
                alt="Delicious Food"
                className="w-full h-full object-cover grayscale-[0.2] group-hover:scale-105 group-hover:grayscale-0 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </motion.div>

            {/* Floating Cards */}
            <motion.div 
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -left-12 top-20 bg-white dark:bg-slate-900 p-4 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 z-20 backdrop-blur-xl bg-white/90"
            >
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-primary flex items-center justify-center shrink-0">
                <Clock size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Fast Delivery</p>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">15-30 Mins</p>
              </div>
            </motion.div>

            <motion.div 
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
              className="absolute -right-8 bottom-32 bg-white dark:bg-slate-900 p-5 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 z-20"
            >
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-500 flex items-center justify-center shrink-0">
                <Zap size={24} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Flash Offer</p>
                <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">50% Discount</p>
              </div>
            </motion.div>

            {/* Floating Food Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8 }}
              className="absolute bottom-10 -left-16 bg-white dark:bg-slate-900 p-4 pr-8 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-white/5 flex items-center gap-4 z-30"
            >
              <div className="w-16 h-16 rounded-[2rem] overflow-hidden shadow-lg border-2 border-primary">
                <img src="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?q=80&w=200&auto=format&fit=crop" alt="food" className="w-full h-full object-cover" />
              </div>
              <div className="space-y-0.5">
                <p className="text-xs font-black text-slate-900 dark:text-white uppercase italic">Spicy Mexican Pizza</p>
                <div className="flex items-center gap-1.5">
                   <div className="flex">
                      {[1,2,3,4,5].map(i => <Star key={i} size={8} fill="#FFD700" color="#FFD700" />)}
                   </div>
                   <span className="text-[9px] font-black text-primary uppercase">Best Seller</span>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
