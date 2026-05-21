import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ChevronLeft, ChevronRight, Star, Clock, Flame } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const trendingItems = [
  { id: 1, name: 'Butter Chicken', price: 299, rating: 4.8, time: '25 min', tag: '🔥 Bestseller', image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=400' },
  { id: 2, name: 'Margherita Pizza', price: 249, rating: 4.7, time: '20 min', tag: '⚡ Quick Bite', image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=400' },
  { id: 3, name: 'Chicken Biryani', price: 279, rating: 4.9, time: '30 min', tag: '👑 Premium', image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&q=80&w=400' },
  { id: 4, name: 'Masala Dosa', price: 129, rating: 4.6, time: '15 min', tag: '💰 Value', image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&q=80&w=400' },
  { id: 5, name: 'Paneer Tikka', price: 199, rating: 4.5, time: '20 min', tag: '🌿 Veg', image: 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=400' },
  { id: 6, name: 'Chocolate Shake', price: 149, rating: 4.8, time: '10 min', tag: '🍫 Sweet', image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=400' },
];

const TrendingNow = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await api.get('/restaurants/trending');
        setItems(data);
      } catch (err) {
        console.error('Trending fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: dir * 400, behavior: 'smooth' });
    }
  };

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-500 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] -z-10" />

      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 bg-rose-500/10 text-rose-500 px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border border-rose-500/10">
              <TrendingUp size={12} /> Hot Payloads
            </div>
            <h2 className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase leading-none">
              Trending <span className="text-primary not-italic">Now</span>
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => scroll(-1)}
              className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-premium active:scale-90"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={() => scroll(1)}
              className="w-14 h-14 rounded-2xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 flex items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all shadow-premium active:scale-90"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll */}
        <div
          ref={scrollRef}
          className="flex gap-8 overflow-x-auto no-scrollbar pb-12 -mx-4 px-4 scroll-smooth"
        >
          {loading ? (
             [...Array(4)].map((_, i) => (
                <div key={i} className="shrink-0 w-[320px] h-[450px] bg-slate-200 dark:bg-slate-800 animate-pulse rounded-[3.5rem]" />
             ))
          ) : items.length === 0 ? (
             <div className="py-20 text-center w-full">
               <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                 <Flame size={32} />
               </div>
               <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No Hot Items in Range</p>
             </div>
          ) : items.map((item, i) => (
            <motion.div
              key={item._id}
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.6 }}
              onClick={() => navigate(`/search?q=${item.name}`)}
              className="shrink-0 w-[320px] bg-white dark:bg-slate-800 rounded-[3.5rem] overflow-hidden border border-slate-100 dark:border-slate-700 shadow-premium cursor-pointer group hover:-translate-y-4 transition-all duration-700"
            >
              {/* Image */}
              <div className="relative h-60 overflow-hidden bg-slate-100 dark:bg-slate-900">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                
                {/* Tag */}
                <div className="absolute top-6 left-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl px-4 py-2 rounded-2xl shadow-xl border border-white/20">
                  <span className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                    <Flame size={14} className="text-orange-500 animate-pulse" /> Bestseller
                  </span>
                </div>
 
                {/* Price Badge */}
                <div className="absolute bottom-6 right-6 bg-primary px-5 py-2.5 rounded-2xl shadow-xl shadow-primary/20">
                  <span className="text-lg font-black text-white italic">₹{item.price}</span>
                </div>
              </div>
 
              {/* Content */}
              <div className="p-8">
                <div className="space-y-1 mb-6">
                  <h3 className="font-black text-slate-900 dark:text-white text-2xl tracking-tighter truncate group-hover:text-primary transition-colors">{item.name}</h3>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">{item.restaurant?.name || 'Central Kitchen'}</p>
                </div>

                <div className="flex items-center justify-between pt-6 border-t border-slate-50 dark:border-slate-700/50">
                  <div className="flex items-center gap-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-500/10 rounded-xl text-amber-600 dark:text-amber-400">
                    <Star size={14} fill="currentColor" strokeWidth={0} />
                    <span className="text-xs font-black">{item.rating || (4 + Math.random()).toFixed(1)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500">
                    <Clock size={14} />
                    <span className="text-[10px] font-black uppercase tracking-widest">{item.deliveryTime || '20-30'} Mins</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrendingNow;
