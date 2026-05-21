import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { Search, Utensils, Zap, Star, Plus, ShoppingCart, Filter } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';

const MenuPage = () => {
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const { addToCart } = useCart();

    useEffect(() => {
        const fetchAllFood = async () => {
            try {
                // Since there might not be a dedicated /foods endpoint, 
                // we'll fetch restaurants and extract their menus
                const { data: restaurants } = await api.get('/restaurants');
                let allFood = [];
                restaurants.forEach(res => {
                    if (res.menu) {
                        res.menu.forEach(item => {
                            allFood.push({ ...item, restaurantId: res._id, restaurantName: res.name });
                        });
                    }
                });
                setFoods(allFood);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };
        fetchAllFood();
    }, []);

    const categories = ['All', 'Pizza', 'Burger', 'Chinese', 'Indian', 'Desserts', 'Beverages'];

    const filteredFoods = foods.filter(food => {
        const matchesSearch = food.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            food.description?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = activeCategory === 'All' || food.category === activeCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white dark:bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <Zap className="text-orange-500 animate-bounce" size={40} />
                <span className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Loading Global Menu...</span>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen pb-24 lg:pb-12">
            {/* Header Section */}
            <div className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden rounded-[3rem] mb-12">
                <div className="absolute inset-0 bg-slate-900">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent" />
                </div>
                
                <div className="relative text-center space-y-4 px-4">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/20 backdrop-blur-md rounded-full border border-orange-500/30"
                    >
                        <Utensils size={14} className="text-orange-500" />
                        <span className="text-[10px] font-black text-orange-500 uppercase tracking-[0.2em]">Universal Menu Hub</span>
                    </motion.div>
                    <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter">
                        Find Your <span className="text-orange-500">Perfect</span> Bite
                    </h1>
                </div>
            </div>

            <div className="container mx-auto px-4">
                {/* Search & Filters */}
                <div className="flex flex-col md:flex-row gap-6 mb-12 items-center justify-between">
                    <div className="relative w-full md:max-w-md group">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={20} />
                        <input 
                            type="text"
                            placeholder="SEARCH DISHES..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 rounded-3xl py-5 pl-16 pr-8 text-[10px] font-black uppercase tracking-widest focus:ring-4 focus:ring-orange-500/10 outline-none transition-all"
                        />
                    </div>

                    <div className="flex items-center gap-2 overflow-x-auto pb-4 md:pb-0 w-full md:w-auto no-scrollbar">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-6 py-3 rounded-full text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                                    activeCategory === cat 
                                    ? 'bg-orange-500 text-white border-orange-500 shadow-lg shadow-orange-500/20' 
                                    : 'bg-white dark:bg-slate-900 text-slate-400 border-slate-100 dark:border-white/5 hover:border-orange-500/30'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Menu Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence>
                        {filteredFoods.map((food, index) => (
                            <motion.div
                                key={food._id || index}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.05 }}
                                className="group bg-white dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl transition-all"
                            >
                                <div className="relative h-56 overflow-hidden">
                                    <img 
                                        src={food.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80'} 
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                        alt={food.name}
                                    />
                                    <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black text-slate-900 uppercase tracking-widest shadow-lg">
                                        ₹{food.price}
                                    </div>
                                    <div className="absolute bottom-4 left-4 flex items-center gap-1 px-2 py-1 bg-black/50 backdrop-blur-md rounded-lg text-white">
                                        <Star size={10} className="fill-orange-500 text-orange-500" />
                                        <span className="text-[9px] font-black">4.5</span>
                                    </div>
                                </div>

                                <div className="p-8 space-y-4">
                                    <div>
                                        <p className="text-[9px] font-black text-orange-500 uppercase tracking-widest mb-1 italic">{food.restaurantName}</p>
                                        <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{food.name}</h3>
                                    </div>
                                    
                                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium line-clamp-2">
                                        {food.description || "A tactical infusion of spices and premium ingredients, crafted for mission-critical hunger."}
                                    </p>

                                    <div className="pt-4 flex items-center justify-between gap-4">
                                        <button 
                                            onClick={() => {
                                                addToCart(food, food.restaurantId);
                                                toast.success(`${food.name} deployed to cart!`);
                                            }}
                                            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white py-4 rounded-2xl flex items-center justify-center gap-3 transition-all active:scale-95 group shadow-lg shadow-orange-500/20"
                                        >
                                            <Plus size={18} />
                                            <span className="text-[10px] font-black uppercase tracking-widest">Add to Cart</span>
                                        </button>
                                        <div className="w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400">
                                            <ShoppingCart size={18} />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredFoods.length === 0 && (
                    <div className="py-32 text-center flex flex-col items-center gap-6">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-slate-200">
                            <Search size={40} />
                        </div>
                        <h3 className="text-xl font-black text-slate-400 uppercase tracking-widest italic">No match found in current sector</h3>
                        <button 
                            onClick={() => { setSearchTerm(''); setActiveCategory('All'); }}
                            className="text-orange-500 text-[10px] font-black uppercase tracking-widest border-b border-orange-500/30 pb-1"
                        >
                            Reset Navigation
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuPage;
