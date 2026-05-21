import React from 'react';
import { motion } from 'framer-motion';
import { Zap, ArrowRight } from 'lucide-react';

const PromoBanners = () => {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Deal of the Day (Pizza) */}
                <div className="lg:col-span-2 relative h-[450px] rounded-[3rem] overflow-hidden group shadow-2xl">
                    <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" 
                        alt="Deal of the Day"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
                    
                    <div className="absolute inset-0 p-12 flex flex-col justify-center space-y-6">
                        <div className="flex items-center gap-2">
                            <Zap className="text-[#FF4B3A]" size={20} fill="currentColor" />
                            <span className="text-sm font-black text-white uppercase tracking-[0.4em]">Deal of the Day</span>
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-5xl md:text-7xl font-black text-white leading-none tracking-tighter uppercase italic">
                                Flat <span className="text-[#FF4B3A]">50% OFF</span>
                            </h2>
                            <p className="text-xl font-bold text-white/80">On orders above $20</p>
                        </div>
                        <div className="flex items-center gap-4 pt-4">
                            <div className="bg-white/10 backdrop-blur-md px-6 py-3 rounded-xl border border-white/20 text-white font-black text-xs uppercase tracking-widest">
                                Use code: <span className="text-[#FF4B3A]">FOODY50</span>
                            </div>
                            <button className="btn-primary px-10 py-4 shadow-2xl shadow-orange-500/40">Order Now</button>
                        </div>
                    </div>
                </div>

                {/* Right Side: Exclusive Offer (Delivery Boy) */}
                <div className="bg-[#FFF8F3] rounded-[3rem] p-10 flex flex-col items-center text-center justify-between border border-orange-100 shadow-xl relative overflow-hidden group">
                    <div className="space-y-2 relative z-10">
                        <h3 className="text-[10px] font-black text-[#FF4B3A] uppercase tracking-[0.4em]">Exclusive Offer</h3>
                        <h2 className="text-2xl font-black text-gray-900 leading-tight uppercase italic tracking-tighter">Get free delivery on your first 3 orders!</h2>
                    </div>
                    
                    <div className="relative w-full aspect-square flex items-center justify-center">
                        <div className="absolute w-48 h-48 bg-orange-100/50 rounded-full blur-3xl animate-pulse" />
                        <img 
                            src="https://img.freepik.com/premium-vector/delivery-man-riding-scooter-motorcycle-isolated-white-background-courier-scooter_165429-1025.jpg" 
                            alt="Delivery Boy"
                            className="w-full h-full object-contain relative z-10 animate-float"
                        />
                    </div>

                    <button className="btn-primary w-full py-4 text-xs uppercase tracking-widest group relative z-10">
                        Order Now <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform ml-2" />
                    </button>
                </div>

            </div>
        </section>
    );
};

export default PromoBanners;
