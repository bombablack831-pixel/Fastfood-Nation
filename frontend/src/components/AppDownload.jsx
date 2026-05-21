import React from 'react';
import { motion } from 'framer-motion';
import { Apple, PlayCircle, QrCode, Smartphone, ArrowRight } from 'lucide-react';

const AppDownload = () => {
  return (
    <section className="py-24 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="bg-slate-900 dark:bg-slate-900/50 rounded-[4rem] p-8 md:p-16 lg:p-24 relative overflow-hidden">
          {/* Animated Background Blobs */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/20 rounded-full blur-[100px]" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center relative z-10">
            {/* Content Left */}
            <div className="space-y-10">
              <div className="space-y-4">
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
                >
                  Best Experience on Mobile
                </motion.p>
                <h2 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none">
                  Download Our <br />
                  <span className="text-primary not-italic">Premium</span> Mobile App.
                </h2>
              </div>
              
              <p className="text-slate-400 text-lg max-w-md font-medium leading-relaxed">
                Experience faster ordering, real-time GPS tracking, and exclusive in-app offers. 
                Available on iOS and Android.
              </p>

              <div className="flex flex-wrap gap-4">
                <button className="flex items-center gap-3 px-8 py-4 bg-white text-slate-900 rounded-[2rem] hover:bg-primary hover:text-white transition-all shadow-xl shadow-white/5 active:scale-95 group">
                  <Apple size={28} />
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Download on</p>
                    <p className="text-sm font-black uppercase tracking-tight italic">App Store</p>
                  </div>
                  <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button className="flex items-center gap-3 px-8 py-4 bg-slate-800 text-white rounded-[2rem] hover:bg-primary transition-all shadow-xl shadow-slate-900/10 active:scale-95 group border border-white/5">
                  <PlayCircle size={28} />
                  <div className="text-left">
                    <p className="text-[8px] font-black uppercase tracking-widest opacity-50">Get it on</p>
                    <p className="text-sm font-black uppercase tracking-tight italic">Google Play</p>
                  </div>
                  <ArrowRight size={16} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              </div>

              <div className="flex items-center gap-6 pt-6 border-t border-white/10">
                <div className="w-16 h-16 p-2 bg-white rounded-2xl">
                   <QrCode size={48} className="text-slate-900" />
                </div>
                <div>
                   <p className="text-sm font-black text-white uppercase italic">Scan to download</p>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Available globally</p>
                </div>
              </div>
            </div>

            {/* Mobile Mockup Right */}
            <div className="relative flex justify-center">
               {/* Decorative Circle */}
               <div className="absolute inset-0 bg-white/5 rounded-full scale-110 border border-white/10 animate-pulse" />
               
               <motion.div 
                 initial={{ opacity: 0, y: 50, rotate: 10 }}
                 whileInView={{ opacity: 1, y: 0, rotate: -5 }}
                 transition={{ duration: 1, type: 'spring' }}
                 className="relative w-72 h-[580px] bg-slate-800 rounded-[3rem] border-8 border-slate-700 shadow-[0_0_80px_rgba(255,75,58,0.3)] overflow-hidden"
               >
                  <img src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=2070&auto=format&fit=crop" alt="app" className="w-full h-full object-cover grayscale-[0.2]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                  
                  {/* Mockup UI Elements */}
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-20 h-1 bg-slate-700 rounded-full" />
                  <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-32 h-1 bg-slate-700 rounded-full" />
               </motion.div>

               {/* Floating Icon */}
               <motion.div 
                 animate={{ y: [0, -20, 0] }}
                 transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                 className="absolute -right-8 top-1/2 -translate-y-1/2 p-6 bg-primary rounded-[2.5rem] shadow-2xl text-white z-20"
               >
                  <Smartphone size={32} />
               </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
