import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, ShoppingBag, ArrowRight, Star, Clock, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useCart } from '../context/CartContext';
import { toast } from 'react-toastify';
import CustomerLayout from '../layouts/CustomerLayout';

const Favorites = () => {
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchFavorites = async () => {
            try {
                const { data } = await api.get('/favorites');
                setFavorites(data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                if (err.response?.status === 401) {
                    navigate('/login');
                }
                setLoading(false);
            }
        };
        fetchFavorites();
    }, [navigate]);

    const handleToggleFavorite = async (foodId) => {
        try {
            await api.post('/favorites', { foodId });
            setFavorites(favorites.filter(item => item._id !== foodId));
            toast.success('Removed from favorites');
        } catch (err) {
            toast.error('Failed to update favorites');
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <CustomerLayout>
            <header className="mb-16 space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 bg-rose-500 rounded-full" />
                    <span className="text-rose-500 font-black text-[10px] uppercase tracking-[0.3em]">Temporal Cravings</span>
                </div>
                <h1 className="text-6xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">Loved <br/> <span className="text-rose-500 italic">Dishes</span></h1>
            </header>

            {favorites.length === 0 ? (
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[4rem] p-24 text-center border-2 border-dashed border-slate-200 dark:border-slate-700">
                    <Heart size={64} className="mx-auto text-slate-200 dark:text-slate-700 mb-8" />
                    <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter mb-4">Your heart is empty</h2>
                    <p className="text-slate-400 dark:text-gray-400 font-bold text-xs uppercase tracking-widest max-w-sm mx-auto mb-10 leading-relaxed">Start exploring and save your favorite dishes here for quick ordering.</p>
                    <Link to="/" className="bg-slate-900 dark:bg-primary text-white px-10 py-5 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-900/10 active:scale-95">
                        Initialize Search
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                    <AnimatePresence>
                        {favorites.map((item, idx) => (
                            <motion.div
                                key={item._id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group bg-white dark:bg-slate-800 rounded-[3rem] overflow-hidden border-2 border-slate-50 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none hover:border-primary/20 transition-all duration-500"
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img src={item.image} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" alt={item.name} />
                                    <div className="absolute top-6 right-6">
                                        <button 
                                            onClick={() => handleToggleFavorite(item._id)}
                                            className="p-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl text-rose-500 shadow-lg hover:bg-rose-500 hover:text-white transition-all"
                                        >
                                            <Heart size={20} fill="currentColor" />
                                        </button>
                                    </div>
                                    <div className="absolute bottom-6 left-6 text-white z-10">
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] opacity-70 mb-1 leading-none italic">{item.restaurant?.name}</p>
                                        <h3 className="text-xl font-black uppercase tracking-tighter italic">{item.name}</h3>
                                    </div>
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                </div>

                                <div className="p-8 space-y-6">
                                    <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                                        <span className="flex items-center gap-2 text-slate-400 dark:text-gray-500">
                                            <Clock size={14} className="text-primary" /> 20-30 MIN
                                        </span>
                                        <span className="text-primary bg-primary/5 px-4 py-2 rounded-xl border border-primary/10 italic">₹{item.price}</span>
                                    </div>
                                    <p className="text-slate-400 dark:text-gray-400 text-xs font-bold line-clamp-2 uppercase tracking-tight italic">{item.description}</p>
                                    
                                    <div className="flex gap-3 pt-2">
                                        <button 
                                            onClick={() => addToCart(item)}
                                            className="flex-1 bg-slate-900 dark:bg-slate-700 text-white px-6 py-4 rounded-[1.5rem] font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-primary transition-all shadow-xl shadow-slate-900/10"
                                        >
                                            <ShoppingBag size={14} /> Commit to Bag
                                        </button>
                                        <Link 
                                            to={`/restaurant/${item.restaurant?._id}`}
                                            className="p-4 bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-gray-400 rounded-[1.5rem] hover:text-primary transition-all border border-slate-100 dark:border-slate-800"
                                        >
                                            <ArrowRight size={18} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </CustomerLayout>
    );
};

export default Favorites;
