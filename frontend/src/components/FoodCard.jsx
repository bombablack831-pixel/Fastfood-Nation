import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { motion } from 'framer-motion';

const FoodCard = ({ food }) => {
  const { cartItems, addToCart, removeFromCart } = useCart();
  const cartItem = cartItems.find((item) => item._id === food._id);

  return (
    <motion.div 
      layout
      whileHover={{ scale: 1.01 }}
      className="bg-white rounded-[2rem] p-4 flex gap-4 items-center shadow-sm hover:shadow-lg transition-all duration-300 border border-slate-100 cursor-pointer"
    >
      <div className="w-24 h-24 shrink-0 rounded-2xl overflow-hidden bg-slate-100">
        <img 
          src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200'} 
          alt={food.name} 
          className="w-full h-full object-cover"
        />
      </div>
      
      <div className="flex-grow py-1">
        <h3 className="font-bold text-slate-900 text-base mb-1 truncate pr-4">{food.name}</h3>
        <p className="text-slate-400 text-xs line-clamp-1 mb-2">{food.description}</p>
        
        <div className="flex items-center gap-3">
          <span className="bg-emerald-500 text-white font-bold text-xs px-2.5 py-1 rounded-[0.5rem] shadow-sm">
            ₹{food.price}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {Math.floor(Math.random() * 400 + 200)} kcal
          </span>
        </div>
      </div>
      
      <div className="shrink-0 flex items-center pr-2">
         {cartItem ? (
           <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 font-bold p-1 rounded-full border border-emerald-100">
             <button onClick={(e) => { e.stopPropagation(); removeFromCart(food._id); }} className="w-6 h-6 rounded-full bg-white flex justify-center items-center shadow-sm hover:bg-emerald-100">-</button>
             <span className="px-1 text-xs">{cartItem.quantity}</span>
             <button onClick={(e) => { e.stopPropagation(); addToCart(food); }} className="w-6 h-6 rounded-full bg-emerald-500 text-white flex justify-center items-center shadow-sm hover:bg-emerald-600">+</button>
           </div>
         ) : (
           <button 
             onClick={(e) => { e.stopPropagation(); addToCart(food); }}
             className="w-8 h-8 flex items-center justify-center bg-slate-100 text-slate-600 rounded-full hover:bg-emerald-500 hover:text-white transition-all font-bold group"
           >
             +
           </button>
         )}
      </div>
    </motion.div>
  );
};

export default FoodCard;
