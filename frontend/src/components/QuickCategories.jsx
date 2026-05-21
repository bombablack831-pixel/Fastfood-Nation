import React from 'react';
import { motion } from 'framer-motion';

const QuickCategories = () => {
  const categories = [
    { name: 'Pizza', icon: '🍕', color: 'bg-orange-50 text-orange-600', border: 'border-orange-100', count: '120+' },
    { name: 'Burger', icon: '🍔', color: 'bg-amber-50 text-amber-600', border: 'border-amber-100', count: '85+' },
    { name: 'Biryani', icon: '🍲', color: 'bg-rose-50 text-rose-600', border: 'border-rose-100', count: '150+' },
    { name: 'Chinese', icon: '🥢', color: 'bg-red-50 text-red-600', border: 'border-red-100', count: '90+' },
    { name: 'Desserts', icon: '🍰', color: 'bg-pink-50 text-pink-600', border: 'border-pink-100', count: '60+' },
    { name: 'Drinks', icon: '🍹', color: 'bg-blue-50 text-blue-600', border: 'border-blue-100', count: '45+' },
    { name: 'Healthy', icon: '🥗', color: 'bg-emerald-50 text-emerald-600', border: 'border-emerald-100', count: '30+' },
    { name: 'Wraps', icon: '🌯', color: 'bg-yellow-50 text-yellow-600', border: 'border-yellow-100', count: '40+' },
  ];

  return (
    <section className="py-20 bg-white dark:bg-slate-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <motion.p 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-primary"
            >
              What's on your mind?
            </motion.p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">
              Popular <span className="text-slate-200 dark:text-slate-800">Categories.</span>
            </h2>
          </div>
          <button className="text-xs font-black text-slate-400 hover:text-primary transition-all uppercase tracking-widest border-b-2 border-transparent hover:border-primary pb-1">
            Browse all categories
          </button>
        </div>

        <div className="flex overflow-x-auto pb-8 gap-6 no-scrollbar snap-x">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.name}
              initial={{ opacity: 0, scale: 0.8, x: 20 }}
              whileInView={{ opacity: 1, scale: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -10 }}
              className="snap-center shrink-0 w-40 p-6 bg-slate-50 dark:bg-white/5 rounded-[3rem] border border-slate-100 dark:border-white/5 cursor-pointer group hover:bg-white dark:hover:bg-white/10 hover:shadow-2xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all text-center space-y-4"
            >
              <div className={`w-20 h-20 mx-auto rounded-[2.5rem] ${cat.color} flex items-center justify-center text-4xl shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                {cat.icon}
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase italic tracking-tight">{cat.name}</h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{cat.count} Items</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default QuickCategories;
