import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search as SearchIcon, X, Clock, TrendingUp, 
    ChevronRight, Star, ArrowRight, History
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const SearchPage = () => {
    const navigate = useNavigate();
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const recentSearches = ['Burger', 'Pizza Palace', 'Biryani', 'Sushi'];
    const trending = [
        { name: 'Cheesy Burger', price: 189, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=2072&auto=format&fit=crop' },
        { name: 'Chicken Biryani', price: 299, image: 'https://images.unsplash.com/photo-1563379091339-03b1cbb8e4c2?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Margherita Pizza', price: 349, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop' },
    ];

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const { data } = await api.get(`/restaurants?search=${query}`);
                    setResults(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-4 space-y-12">
                
                {/* Search Bar HUD */}
                <div className="relative group">
                    <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#FF4B3A] transition-colors" size={24} />
                    <input
                        type="text"
                        placeholder="Search for food, restaurants, cuisines..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        autoFocus
                        className="w-full bg-gray-50 border border-gray-100 rounded-[2rem] py-6 px-16 text-lg font-bold focus:bg-white focus:border-[#FF4B3A] focus:outline-none transition-all shadow-sm"
                    />
                    {query && (
                        <button 
                            onClick={() => setQuery('')}
                            className="absolute right-6 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400 hover:text-red-500"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>

                <AnimatePresence mode='wait'>
                    {!query ? (
                        <motion.div 
                            key="initial"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-12"
                        >
                            {/* Recent Searches */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 px-2">
                                    <History size={16} className="text-gray-400" />
                                    <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Recent Searches</h2>
                                </div>
                                <div className="flex flex-wrap gap-3">
                                    {recentSearches.map(s => (
                                        <button 
                                            key={s}
                                            onClick={() => setQuery(s)}
                                            className="px-6 py-2.5 bg-gray-50 border border-gray-100 rounded-full text-xs font-black text-gray-600 hover:bg-orange-50 hover:text-[#FF4B3A] hover:border-orange-100 transition-all"
                                        >
                                            {s}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Trending Now */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-2 px-2">
                                    <TrendingUp size={16} className="text-[#FF4B3A]" />
                                    <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest">Trending Now</h2>
                                </div>
                                <div className="grid grid-cols-1 gap-4">
                                    {trending.map((item, idx) => (
                                        <motion.div
                                            key={item.name}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.1 }}
                                            className="flex gap-6 p-4 rounded-3xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all cursor-pointer group"
                                        >
                                            <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-50">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <h3 className="font-black text-gray-900 text-lg">{item.name}</h3>
                                                <p className="text-xs font-black text-[#FF4B3A] tracking-tighter mt-1">₹{item.price}</p>
                                            </div>
                                            <div className="flex items-center pr-4">
                                                <ChevronRight size={20} className="text-gray-300 group-hover:text-[#FF4B3A] transition-colors" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="results"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="space-y-6"
                        >
                            <div className="flex items-center justify-between px-2">
                                <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">
                                    {loading ? 'Searching...' : `${results.length} Results Found`}
                                </h2>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {results.map(res => (
                                    <div 
                                        key={res._id}
                                        onClick={() => navigate(`/restaurant/${res._id}`)}
                                        className="flex gap-4 p-4 rounded-3xl bg-white border border-gray-100 hover:border-orange-200 hover:shadow-md transition-all cursor-pointer group"
                                    >
                                        <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-gray-50">
                                            <img src={res.image} alt={res.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 flex flex-col justify-center">
                                            <h3 className="font-black text-gray-900 truncate">{res.name}</h3>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star size={12} className="text-green-500 fill-green-500" />
                                                <span className="text-[10px] font-black text-green-600">{res.rating || '4.5'}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {!loading && results.length === 0 && (
                                <div className="text-center py-20">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
                                        <SearchIcon size={32} />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">No Operatives Found</h3>
                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-2">Try adjusting your search parameters</p>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default SearchPage;
