import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const TrendingCard = ({ item }) => {
  const { addToCart } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(item);
    toast.success(`${item.name} added to cart!`);
  };
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="min-w-[280px] bg-white rounded-[2rem] p-4 border border-slate-100 shadow-xl shadow-slate-200/50 relative group"
    >
      <div className="relative h-40 rounded-2xl overflow-hidden mb-4">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-xl text-[10px] font-black shadow-lg flex items-center gap-1 border border-white/20">
          <Star size={12} className="fill-emerald-500 text-emerald-500" />
          4.9
        </div>
      </div>
      
      <div className="space-y-1 px-1">
        <div className="flex justify-between items-start">
          <h4 className="font-black text-slate-800 text-sm uppercase tracking-tight line-clamp-1">{item.name}</h4>
          <span className="text-emerald-500 font-black text-sm">₹{item.price}</span>
        </div>
        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center gap-1">
          <Clock size={12} /> {item.restaurant?.name || 'Top Rated'}
        </p>
      </div>

      <button 
        onClick={handleAdd}
        className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-3 rounded-2xl shadow-xl shadow-slate-900/20 hover:bg-emerald-500 transition-all active:scale-90"
      >
        <Plus size={20} strokeWidth={3} />
      </button>
    </motion.div>
  );
};

export default TrendingCard;
