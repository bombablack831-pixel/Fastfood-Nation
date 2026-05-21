import React from 'react';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden relative">
            {/* Background Glitch Effect */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-rose-600 blur-[120px] animate-pulse" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-violet-600 blur-[120px] animate-pulse delay-700" />
            </div>

            <div className="relative z-10">
                <div className="w-24 h-24 bg-rose-500/10 border border-rose-500/20 rounded-[2.5rem] flex items-center justify-center text-rose-500 mb-10 shadow-2xl animate-bounce">
                    <ShieldAlert size={48} strokeWidth={1.5} />
                </div>
                
                <div className="space-y-4 mb-12">
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                        <span className="text-[10px] font-black text-rose-500 uppercase tracking-[0.4em]">Firewall: Critical Alert</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-[0.9]">
                        Clearance <br/> <span className="text-rose-500 italic underline decoration-rose-500/30">Denied</span>
                    </h1>
                </div>

                <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.2em] max-w-md leading-relaxed mx-auto italic border-l-2 border-rose-500/30 pl-6">
                    Logistics Protocol 403: You do not possess the required security clearance to access this sector. Terminal entry aborted.
                </p>

                <div className="mt-16 flex flex-col items-center gap-6">
                    <Link to="/" className="group flex items-center gap-4 bg-white text-black px-12 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] hover:scale-105 transition-all shadow-2xl shadow-white/5 active:scale-95">
                        <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" /> Return to Safety
                    </Link>
                    <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Error Code: AX-SEC-PROTECT</p>
                </div>
            </div>
        </div>
    );
};

export default Unauthorized;
