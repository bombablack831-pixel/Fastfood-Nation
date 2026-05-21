import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Star, Clock, Info, ChevronLeft, 
    Plus, Minus, ShoppingCart, Search,
    Filter, Heart, Share2, MapPin
} from 'lucide-react';
import api from '../utils/api';
import { useCart } from '../context/CartContext';

const RestaurantDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [restaurant, setRestaurant] = useState(null);
    const [menu, setMenu] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeCategory, setActiveCategory] = useState('All');
    
    const { cartItems, addToCart, removeFromCart } = useCart();

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const [resRest, resMenu] = await Promise.all([
                    api.get(`/restaurants/${id}`),
                    api.get(`/restaurants/${id}/menu`)
                ]);
                setRestaurant(resRest.data);
                setMenu(resMenu.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [id]);

    const getItemQuantity = (itemId) => {
        const item = cartItems.find(i => i._id === itemId);
        return item ? item.quantity : 0;
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF4B3A] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white pb-32">
            {/* Header Banner */}
            <div className="relative h-[350px] md:h-[450px] w-full overflow-hidden">
                <img 
                    src={restaurant?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=2080&auto=format&fit=crop'} 
                    alt={restaurant?.name}
                    className="w-full h-full object-cover scale-105 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-black/20 to-transparent" />
                
                <div className="absolute top-8 left-8 md:left-12 flex gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-white hover:bg-white hover:text-gray-900 transition-all border border-white/20"
                    >
                        <ChevronLeft size={24} />
                    </button>
                </div>

                <div className="absolute bottom-12 left-8 md:left-12 right-8 md:right-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div className="space-y-4">
                        <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-1.5 bg-[#FF4B3A] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg">Premium Hub</span>
                            <span className="px-4 py-1.5 bg-white/20 backdrop-blur-md text-white text-[10px] font-black rounded-full uppercase tracking-widest border border-white/20">Fast Delivery</span>
                        </div>
                        <h1 className="text-4xl md:text-7xl font-black text-white tracking-tighter uppercase italic leading-none drop-shadow-2xl">
                            {restaurant?.name}
                        </h1>
                        <div className="flex items-center gap-6 text-white/90">
                            <div className="flex items-center gap-2">
                                <Star className="text-yellow-400 fill-yellow-400" size={18} />
                                <span className="text-sm font-black">{restaurant?.rating || '4.5'} (500+ Reviews)</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Clock size={18} />
                                <span className="text-sm font-black">25-35 MINS</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="flex gap-3">
                        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all shadow-xl border border-gray-100">
                            <Heart size={20} />
                        </button>
                        <button className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 hover:text-[#FF4B3A] transition-all shadow-xl border border-gray-100">
                            <Share2 size={20} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 mt-12 space-y-12">
                
                {/* Menu Controls */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-gray-100 pb-8">
                    <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                        {['All', 'Popular', 'Vegetarian', 'Non-Veg', 'Drinks'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border ${
                                    activeCategory === cat 
                                    ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                                    : 'bg-white text-gray-400 border-gray-100 hover:border-orange-100'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="relative w-full md:w-72 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-[#FF4B3A] transition-colors" size={16} />
                        <input 
                            type="text" 
                            placeholder="Search in menu..."
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:bg-white focus:border-[#FF4B3A] focus:outline-none transition-all"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {menu?.map((item, idx) => (
                        <motion.div
                            key={item._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-6 rounded-[2.5rem] bg-white border border-gray-100 hover:border-orange-100 hover:shadow-2xl transition-all group flex gap-6"
                        >
                            <div className="flex-1 space-y-4">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-3 h-3 border-2 rounded-sm ${item.isVeg ? 'border-green-600' : 'border-red-600'} flex items-center justify-center p-0.5`}>
                                            <div className={`w-full h-full rounded-full ${item.isVeg ? 'bg-green-600' : 'bg-red-600'}`} />
                                        </div>
                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Recommended</span>
                                    </div>
                                    <h3 className="text-lg font-black text-gray-900 tracking-tight group-hover:text-[#FF4B3A] transition-colors">{item.name}</h3>
                                    <p className="text-[10px] font-bold text-gray-400 leading-relaxed line-clamp-2">{item.description || 'Finest ingredients prepared with master precision.'}</p>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-xl font-black text-gray-900 tracking-tighter italic">₹{item.price}</span>
                                    
                                    <div className="flex items-center bg-gray-50 rounded-xl p-1 border border-gray-100 shadow-inner">
                                        {getItemQuantity(item._id) > 0 ? (
                                            <div className="flex items-center gap-3 px-2">
                                                <button onClick={() => removeFromCart(item._id)} className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#FF4B3A] shadow-sm hover:bg-[#FF4B3A] hover:text-white transition-all">
                                                    <Minus size={16} />
                                                </button>
                                                <span className="text-sm font-black text-gray-900 w-4 text-center">{getItemQuantity(item._id)}</span>
                                                <button onClick={() => addToCart(item, restaurant)} className="w-8 h-8 rounded-lg bg-[#FF4B3A] flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-all">
                                                    <Plus size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => addToCart(item, restaurant)}
                                                className="px-6 py-2 bg-white text-[#FF4B3A] text-[10px] font-black uppercase tracking-widest rounded-lg border border-gray-100 hover:bg-[#FF4B3A] hover:text-white transition-all shadow-sm"
                                            >
                                                Add Item
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="w-24 h-24 md:w-32 md:h-32 rounded-3xl overflow-hidden shrink-0 shadow-lg border border-gray-100">
                                <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop'} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                            </div>
                        </motion.div>
                    ))}
                </div>

            </div>

            {/* Floating Cart Button */}
            <AnimatePresence>
                {cartItems.length > 0 && (
                    <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        onClick={() => navigate('/cart')}
                        className="fixed bottom-10 left-1/2 -translate-x-1/2 w-[90%] max-w-lg bg-gray-900 text-white p-5 rounded-[2.5rem] shadow-2xl flex items-center justify-between cursor-pointer group z-[60]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-[#FF4B3A] rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                                <ShoppingCart size={24} />
                            </div>
                            <div>
                                <p className="text-xs font-black uppercase italic tracking-widest">{cartItems.length} Assets Selected</p>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Ready for deployment</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest leading-none">Total Pay</p>
                                <p className="text-xl font-black text-[#FF4B3A] tracking-tighter italic">₹{cartItems.reduce((acc, i) => acc + (i.price * i.quantity), 0)}</p>
                            </div>
                            <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-[#FF4B3A] transition-all">
                                <ChevronLeft className="rotate-180" size={20} />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
};

export default RestaurantDetails;
