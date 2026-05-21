import React from 'react';
import { motion } from 'framer-motion';

const OfferBanner = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
           initial={{ opacity: 0, scale: 0.9 }}
           whileInView={{ opacity: 1, scale: 1 }}
           viewport={{ once: true }}
           className="relative min-h-[450px] md:h-[400px] rounded-[2rem] md:rounded-[3rem] overflow-hidden bg-primary shadow-2xl shadow-primary/30"
        >
          {/* Background Decorative Circles */}
          <div className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full blur-3xl text-primary"></div>
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-secondary/20 rounded-full blur-3xl text-primary"></div>

          <div className="absolute inset-0 flex flex-col md:flex-row items-center justify-between px-6 md:px-24 py-12 md:py-0">
            <div className="text-center md:text-left z-10">
              <span className="inline-block py-1.5 px-5 bg-white text-primary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] rounded-full mb-6">
                Limited Time Offer
              </span>
              <h2 className="text-3xl md:text-6xl font-black text-white mb-6 leading-tight">
                Get Up To <br className="hidden md:block" /> <span className="text-dark">50% OFF</span>
              </h2>
              <p className="text-white/80 text-sm md:text-lg mb-10 max-w-sm font-medium mx-auto md:mx-0">
                Delicious food at unbeatable prices. Order now and enjoy big savings!
              </p>
              <button className="bg-dark text-white hover:bg-white hover:text-dark px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95">
                Claim Now
              </button>
            </div>

            <div className="relative z-10 hidden lg:block transform hover:rotate-6 transition-transform duration-700">
                <div className="w-80 h-80 bg-white/20 backdrop-blur-md rounded-[3rem] p-6 flex items-center justify-center border border-white/30 rotate-12">
                    <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop" 
                        className="w-full h-full object-cover rounded-[2rem] shadow-2xl -rotate-12"
                        alt="Promo Pizza"
                    />
                </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default OfferBanner;
