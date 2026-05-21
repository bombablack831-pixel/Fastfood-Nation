import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const categories = [
  { name: 'Pizza',   emoji: '🍕', color: 'bg-rose-50', text: 'text-rose-600' },
  { name: 'Burger',  emoji: '🍔', color: 'bg-amber-50', text: 'text-amber-600' },
  { name: 'Biryani', emoji: '🍗', color: 'bg-orange-50', text: 'text-orange-600' },
  { name: 'Rolls',   emoji: '🌮', color: 'bg-emerald-50', text: 'text-emerald-600' },
  { name: 'Sushi',   emoji: '🍣', color: 'bg-sky-50', text: 'text-sky-600' },
  { name: 'Dessert', emoji: '🍰', color: 'bg-fuchsia-50', text: 'text-fuchsia-600' },
  { name: 'Indian',  emoji: '🫕', color: 'bg-red-50', text: 'text-red-600' },
  { name: 'Coffee',  emoji: '☕', color: 'bg-stone-50', text: 'text-stone-600' },
];

const Categories = ({ activeCategory, setActiveCategory }) => {
  const navigate = useNavigate();

  const handleClick = (name) => {
    setActiveCategory(activeCategory === name ? 'All' : name);
    navigate(`/search?q=${name}`);
  };

  return (
    <section className="py-2 bg-transparent">
      <div className="px-4">
        <div className="flex gap-6 overflow-x-auto no-scrollbar py-4 px-2">
          {categories.map((cat, idx) => {
            const isActive = activeCategory === cat.name;
            return (
              <motion.button
                key={idx}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(cat.name)}
                className="flex flex-col items-center gap-3 shrink-0 group transition-all"
              >
                {/* Visual Container */}
                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center text-3xl transition-all relative ${
                  isActive
                    ? 'bg-primary shadow-2xl shadow-primary/30 ring-4 ring-primary/10'
                    : 'bg-white border-2 border-slate-50 shadow-sm group-hover:border-primary/20'
                }`}>
                  <span className={`${isActive ? 'scale-110' : 'group-hover:scale-110 transition-transform duration-500'}`}>
                    {cat.emoji}
                  </span>
                  {isActive && (
                    <motion.div 
                        layoutId="active-pill"
                        className="absolute -bottom-1 w-2 h-2 bg-primary rounded-full"
                    />
                  )}
                </div>
                
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all ml-1 ${
                  isActive ? 'text-primary' : 'text-slate-400 group-hover:text-slate-900 group-hover:tracking-[0.3em]'
                }`}>
                  {cat.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Categories;

