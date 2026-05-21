import React from 'react';
import { motion } from 'framer-motion';
import { Plus, Star, Clock } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';

const DishCard = ({ dish }) => {
    const { addToCart } = useCart();

    const handleAdd = (e) => {
        e.stopPropagation();
        addToCart(dish, dish.restaurant);
        toast.success(`${dish.name} added to cart!`);
    };

    return (
        <motion.div 
            whileHover={{ y: -10 }}
            className="bg-white rounded-[2rem] p-4 border border-gray-100 shadow-soft hover:shadow-2xl transition-all duration-500 group flex flex-col h-full"
        >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-4">
                <img 
                    src={dish.image} 
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-3 right-3 px-2 py-1 bg-white/90 backdrop-blur-md rounded-lg flex items-center gap-1 shadow-sm">
                    <Star size={10} className="text-[#FF4B3A] fill-[#FF4B3A]" />
                    <span className="text-[10px] font-black text-gray-900">4.8</span>
                </div>
            </div>

            <div className="flex flex-col flex-1 space-y-2">
                <div className="flex items-start justify-between gap-2">
                    <h3 className="text-sm font-black text-gray-900 tracking-tight leading-tight line-clamp-2">{dish.name}</h3>
                    <span className="text-sm font-black text-[#FF4B3A]">₹{dish.price}</span>
                </div>
                
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest line-clamp-1">
                    {dish.category}
                </p>

                <div className="pt-4 mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-gray-400">
                        <Clock size={12} />
                        <span className="text-[10px] font-bold uppercase tracking-tight">20 MIN</span>
                    </div>
                    <button 
                        onClick={handleAdd}
                        className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center hover:bg-[#FF4B3A] transition-all shadow-lg active:scale-90"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
};

const PopularDishes = ({ dishes, loading }) => {
    return (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
            <div className="flex items-center justify-between mb-10">
                <div>
                    <h2 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic">
                        Trending <span className="text-[#FF4B3A] not-italic">Dishes.</span>
                    </h2>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.3em] mt-2">Most deployed culinary assets this week.</p>
                </div>
                <button className="text-[10px] font-black text-[#FF4B3A] uppercase tracking-widest hover:underline">See full menu</button>
            </div>

            {loading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="aspect-[1/1.3] bg-gray-50 rounded-[2rem] animate-pulse" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {dishes.slice(0, 5).map((dish) => (
                        <DishCard key={dish._id} dish={dish} />
                    ))}
                </div>
            )}
        </section>
    );
};

export default PopularDishes;
