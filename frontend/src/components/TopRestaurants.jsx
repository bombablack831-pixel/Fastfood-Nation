import React from 'react';
import { motion } from 'framer-motion';
import { Star, Clock, MapPin, Heart, ArrowRight, Zap, BadgeCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const TopRestaurants = ({ restaurants, loading }) => {
  if (loading) {
    return (
      <section className="py-20 bg-slate-50 dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="h-10 w-64 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-800 rounded-[3rem] animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden">
      {/* Decorative Text */}
      <div className="absolute top-10 left-0 text-[10rem] font-black text-slate-100 dark:text-white/5 select-none -z-0 pointer-events-none uppercase italic tracking-tighter opacity-50">
        PREMIUM
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
          <div className="space-y-2">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
            >
              The Best of the Best
            </motion.p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Popular <span className="text-slate-300 dark:text-slate-700">Restaurants.</span>
            </h2>
          </div>
          <Link to="/restaurants" className="group flex items-center gap-2 bg-white dark:bg-slate-900 px-6 py-3 rounded-2xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 hover:bg-primary hover:text-white transition-all text-xs font-black uppercase tracking-widest">
            Explore All
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {restaurants.slice(0, 6).map((restaurant, i) => (
            <motion.div
              key={restaurant._id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -15 }}
              className="group bg-white dark:bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-white/5 relative"
            >
              {/* Image Container */}
              <div className="relative h-64 overflow-hidden">
                <img 
                  src={restaurant.image || 'https://images.unsplash.com/photo-1552566626-52f8b828add9?q=80&w=2070&auto=format&fit=crop'} 
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent opacity-60" />
                
                {/* Badges */}
                <div className="absolute top-6 left-6 flex flex-col gap-2">
                  {restaurant.isPromoted && (
                    <div className="bg-primary/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-primary/20">
                      <Zap size={12} fill="currentColor" />
                      Promoted
                    </div>
                  )}
                  {restaurant.rating >= 4.5 && (
                    <div className="bg-emerald-500/90 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-lg shadow-emerald-500/20">
                      <Star size={12} fill="currentColor" />
                      Top Rated
                    </div>
                  )}
                </div>

                <button className="absolute top-6 right-6 w-10 h-10 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-rose-500 hover:scale-110 transition-all border border-white/30">
                  <Heart size={20} />
                </button>

                {/* Offer Badge Overlay */}
                <div className="absolute bottom-6 left-6 bg-white dark:bg-slate-900 px-4 py-2 rounded-2xl shadow-xl border border-slate-100 dark:border-white/10">
                   <p className="text-[10px] font-black text-primary uppercase tracking-widest leading-none mb-1">Flash Deal</p>
                   <p className="text-xs font-black text-slate-900 dark:text-white uppercase italic">30% OFF UPTO ₹150</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 space-y-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{restaurant.name}</h3>
                      <BadgeCheck size={18} className="text-blue-500 shrink-0" fill="currentColor" />
                    </div>
                    <p className="text-xs font-medium text-slate-400 line-clamp-1">
                      {restaurant.cuisines?.join(', ') || 'Continental, Chinese, Italian'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 px-3 py-1.5 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 rounded-xl text-xs font-black">
                    <Star size={14} fill="currentColor" />
                    {restaurant.rating || '4.2'}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                      <Clock size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{restaurant.deliveryTime || '25-30'} mins</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-400">
                      <MapPin size={16} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{restaurant.distance || '2.4'} km</span>
                  </div>
                  <Link 
                    to={`/restaurant/${restaurant._id}`}
                    className="w-10 h-10 bg-primary text-white rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-lg shadow-primary/20"
                  >
                    <ArrowRight size={20} />
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TopRestaurants;
