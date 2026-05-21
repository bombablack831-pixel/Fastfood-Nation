import React from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Zap, Globe } from 'lucide-react';

const NetworkTicker = () => {
    const statusItems = [
        { icon: <Activity size={12} />, text: "GRID STATUS: 100% OPERATIONAL", color: "text-emerald-500" },
        { icon: <Globe size={12} />, text: "DEPLOYMENT NODES: 8 ACTIVE REGIONS", color: "text-blue-500" },
        { icon: <ShieldCheck size={12} />, text: "LOGISTICS ENCRYPTION: ACTIVE", color: "text-violet-500" },
        { icon: <Zap size={12} />, text: "PEAK VELOCITY MODE: ENABLED", color: "text-orange-500" },
        { icon: <Activity size={12} />, text: "ACTIVE PAYLOADS: 1,242 IN TRANSIT", color: "text-emerald-500" },
    ];

    return (
        <div className="bg-slate-900 border-b border-white/5 py-3 overflow-hidden relative hidden md:block">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-slate-900 to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-slate-900 to-transparent z-10" />
            
            <motion.div 
                className="flex gap-12 whitespace-nowrap"
                animate={{ x: [0, -1000] }}
                transition={{ 
                    duration: 20, 
                    repeat: Infinity, 
                    ease: "linear" 
                }}
            >
                {[...statusItems, ...statusItems, ...statusItems].map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                        <span className={item.color}>{item.icon}</span>
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-slate-400 italic">
                            {item.text}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-slate-800" />
                    </div>
                ))}
            </motion.div>
        </div>
    );
};

export default NetworkTicker;
