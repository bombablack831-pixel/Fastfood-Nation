import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Search, MapPin, Star, Clock, Filter, ChevronRight, 
    ArrowRight, Utensils, Zap, ShieldCheck 
} from 'lucide-react';
import { Link } from 'react-router-dom';

const RestaurantCard = ({ restaurant }) => (
    <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="group"
    >
        <Link to={`/restaurant/${restaurant._id}`} className="block bg-white dark:bg-slate-800 rounded-[3rem] p-4 border-2 border-slate-50 dark:border-slate-800 shadow-xl shadow-slate-200/20 dark:shadow-none hover:shadow-2xl hover:shadow-primary/10 transition-all hover:-translate-y-2 relative overflow-hidden">
            <div className="relative aspect-[16/10] w-full rounded-[2.5rem] overflow-hidden mb-6">
                <img
                    src={restaurant.image || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1000'}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={restaurant.name}
                />
                <div className="absolute top-4 left-4 bg-slate-900/80 backdrop-blur-md text-white text-[9px] font-black px-4 py-2 rounded-xl uppercase tracking-[0.2em]">
                    Node: {restaurant._id.slice(-4).toUpperCase()}
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-900/80 to-transparent p-5">
                    <div className="flex items-center gap-2 text-white">
                        <Clock size={14} className="text-primary" />
                        <span className="text-xs font-black uppercase tracking-widest">{restaurant.deliveryTime || 25}-35 MINS</span>
                    </div>
                </div>
            </div>

            <div className="px-2">
                <div className="flex items-center justify-between gap-4 mb-3">
                    <h3 className="font-black text-slate-900 dark:text-white text-xl leading-tight truncate italic uppercase tracking-tighter">{restaurant.name}</h3>
                    <div className="flex items-center gap-1.5 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-600 dark:text-yellow-500 px-3 py-1.5 rounded-xl text-[10px] font-black border border-yellow-100 dark:border-yellow-500/10">
                        <Star size={12} fill="currentColor" stroke="none" />
                        <span>{restaurant.rating || '4.2'}</span>
                    </div>
                </div>
                
                <div className="flex items-center gap-2 text-slate-400 mb-6">
                    <MapPin size={12} className="text-primary" />
                    <p className="text-[10px] font-black uppercase tracking-widest truncate italic">
                        {Array.isArray(restaurant.cuisine) ? restaurant.cuisine.join(' • ') : restaurant.cuisine || 'Gourmet Logistics'}
                    </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700/50">
                    <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest group-hover:text-primary transition-colors">Initiate Payload</span>
                    <div className="w-8 h-8 rounded-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                        <ArrowRight size={14} />
                    </div>
                </div>
            </div>
        </Link>
    </motion.div>
);

const RestaurantsPage = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [activeFilter, setActiveFilter] = useState('All');

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await api.get('/restaurants');
                setRestaurants(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    const categories = ['All', 'Premium', 'Fastest', 'Top Rated', 'Healthy', 'Offers'];

    const filteredRestaurants = restaurants.filter(res => {
        const matchesSearch = res.name.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = activeFilter === 'All' || 
            (activeFilter === 'Fastest' && (res.deliveryTime <= 30)) ||
            (activeFilter === 'Top Rated' && res.rating >= 4.5);
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 pb-20">
            {/* Tactical Header */}
            <header className="pt-24 pb-12 bg-white dark:bg-slate-800 border-b border-slate-100 dark:border-slate-700/50 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 blur-[100px] rounded-full" />
                </div>
                
                <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row md:items-end justify-between gap-8 relative z-10">
                    <div className="space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[9px] font-black uppercase tracking-[0.3em] border border-primary/10">
                            <Utensils size={10} /> Central Kitchen Directory
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter italic uppercase">
                            The <span className="text-primary not-italic">Network</span>
                        </h1>
                        <p className="text-slate-400 font-bold max-w-md text-sm">
                            Access our global network of premier kitchens and logistics nodes. 100% operational efficiency.
                        </p>
                    </div>

                    <div className="w-full md:w-96">
                        <div className="relative group">
                            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-primary transition-colors" size={20} />
                            <input 
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Locate specific node..."
                                className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-transparent focus:border-primary/20 rounded-[2rem] pl-16 pr-6 py-5 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all shadow-sm"
                            />
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 lg:px-12 py-12">
                {/* Tactical Filters */}
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-8">
                    <div className="flex items-center gap-2 pr-4 border-r border-slate-200 dark:border-slate-700 mr-4">
                        <Filter size={14} className="text-slate-400" />
                        <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest whitespace-nowrap">Filter Grid:</span>
                    </div>
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveFilter(cat)}
                            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                                activeFilter === cat 
                                ? 'bg-primary text-white shadow-lg shadow-primary/20 rotate-1' 
                                : 'bg-white dark:bg-slate-800 text-slate-500 hover:text-primary border border-slate-100 dark:border-slate-700'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Restaurant Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {[1,2,3,4,5,6].map(i => (
                            <div key={i} className="h-96 rounded-[3rem] bg-white dark:bg-slate-800 border-2 border-slate-50 dark:border-slate-700 animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        <AnimatePresence mode="popLayout">
                            {filteredRestaurants.map((res) => (
                                <RestaurantCard key={res._id} restaurant={res} />
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {!loading && filteredRestaurants.length === 0 && (
                    <div className="py-24 text-center">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Zap size={32} className="text-slate-300" />
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic">No Active Nodes Found</h3>
                        <p className="text-slate-400 font-bold mt-2">Adjust your search parameters or check connection.</p>
                    </div>
                )}
            </main>
        </div>
    );
};

export default RestaurantsPage;
