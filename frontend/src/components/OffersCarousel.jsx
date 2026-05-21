import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Zap, Gift, IndianRupee, Clock, Flame, ShieldAlert } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const staticOffers = [
  {
    _id: 'static-1',
    title: '50% OFF',
    subtitle: 'Up to ₹100',
    description: 'On your first order',
    code: 'WELCOME50',
    discountValue: 100,
    minPurchase: 199
  },
  {
    _id: 'static-2',
    title: 'FREE DELIVERY',
    subtitle: 'No Minimum',
    description: 'On premium kitchens',
    code: 'FREERIDE',
    discountValue: 50,
    minPurchase: 0
  }
];

const OffersCarousel = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCoupons = async () => {
      try {
        const { data } = await api.get('/coupons/active');
        if (data && data.length > 0) {
          setOffers(data);
        } else {
          setOffers(staticOffers);
        }
      } catch (err) {
        console.error('Error fetching coupons:', err);
        setOffers(staticOffers);
      } finally {
        setLoading(false);
      }
    };
    fetchCoupons();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  const offerGradients = [
    'from-emerald-600/20 to-teal-900/40',
    'from-cyan-600/20 to-blue-900/40',
    'from-purple-600/20 to-indigo-900/40',
    'from-rose-600/20 to-orange-900/40'
  ];

  return (
    <section className="py-12 bg-transparent relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-12">
        {/* Header HUD */}
        <div className="flex items-end justify-between mb-10 pl-2">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-emerald-500/20">
              <Gift size={12} /> Strategic Advantages
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter italic uppercase leading-none">
                Tactical <span className="text-emerald-500 not-italic">Intel</span>
            </h2>
          </div>
          <div className="flex items-center gap-4 hidden md:flex">
            <button
              onClick={() => scroll(-1)}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all active:scale-90"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 hover:text-emerald-500 hover:border-emerald-500/50 transition-all active:scale-90"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll HUD */}
        <div
          ref={scrollRef}
          className="flex gap-6 overflow-x-auto no-scrollbar pb-8 -mx-4 px-4 scroll-smooth"
        >
          {loading ? (
             [...Array(3)].map((_, i) => (
                <div key={i} className="shrink-0 w-[350px] md:w-[450px] h-64 bg-white/5 border border-white/5 animate-pulse rounded-[2.5rem]" />
             ))
          ) : offers.map((offer, i) => (
            <motion.div
              key={offer._id || i}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`shrink-0 w-[320px] md:w-[450px] p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-white/10 bg-gradient-to-br ${offerGradients[i % offerGradients.length]} text-white backdrop-blur-xl group relative overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all duration-500`}
              onClick={() => navigate('/search')}
            >
              {/* Scanline Effect */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-emerald-500/30 group-hover:animate-[scanline_3s_linear_infinite] opacity-0 group-hover:opacity-100" />
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-3xl md:text-5xl font-black italic tracking-tighter mb-2 leading-none">
                      {offer.discountValue ? `₹${offer.discountValue} OFF` : `${offer.discountPercentage}% OFF`}
                    </h3>
                    <p className="text-emerald-400 font-bold text-[9px] md:text-[10px] uppercase tracking-[0.2em] mt-3">
                       Protocol: <span className="text-white">{offer.code || 'HUB60'}</span>
                    </p>
                  </div>
                  <div className="bg-emerald-500/10 backdrop-blur-md p-3 md:p-4 rounded-2xl border border-emerald-500/20 group-hover:bg-emerald-500 group-hover:text-black transition-all">
                    <Zap size={24} className="animate-pulse" />
                  </div>
                </div>

                <div className="mt-8 md:mt-12 flex items-end justify-between gap-4">
                  <div className="space-y-3">
                    <p className="text-slate-400 text-[8px] md:text-[9px] font-bold uppercase tracking-widest leading-relaxed">
                        {offer.minPurchase ? `Authorized for orders above ₹${offer.minPurchase}` : 'No Minimum Deployment Limit'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Clock size={10} className="text-emerald-500/50" />
                      <p className="text-[7px] md:text-[8px] font-black uppercase tracking-[0.3em] text-slate-500">Temporal Access Window: Active</p>
                    </div>
                  </div>
                  <button className="bg-emerald-500 text-black px-6 py-3 rounded-xl md:rounded-2xl font-black uppercase tracking-[0.2em] text-[8px] md:text-[10px] hover:bg-emerald-400 transition-all shadow-lg active:scale-95 shrink-0">
                    Extract
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersCarousel;
