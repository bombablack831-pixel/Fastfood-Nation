import React, { useState, useEffect } from 'react';
import RestaurantLayout from '../../layouts/RestaurantLayout';
import { Star, MapPin, CheckCircle2, Clock, Phone, MoreHorizontal, Users, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../utils/api';
import { toast } from 'react-toastify';



const RidersList = () => {
    const [riders, setRiders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [assigningId, setAssigningId] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    const [filter, setFilter] = useState('all'); // all, available, rated

    const fetchRiders = async () => {
        try {
            const { data } = await api.get('/restaurants/riders');
            setRiders(data);
        } catch (err) {
            console.error('Rider fetch error:', err.response?.data || err.message);
            toast.error(`Failed to fetch riders: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRiders();
    }, []);

    const handleAssign = async (riderId) => {
        setAssigningId(riderId);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            toast.success('Rider assigned successfully! 🚀');
        } catch (err) {
            toast.error('Assignment failed');
        } finally {
            setAssigningId(null);
        }
    };

    const handleAutoAssign = () => {
        const availableRiders = riders.filter(r => r.status === 'available');
        if (availableRiders.length === 0) {
            return toast.warning('No available riders found for auto-assignment');
        }
        // Sort by rating desc
        const bestRider = [...availableRiders].sort((a, b) => (b.rating || 0) - (a.rating || 0))[0];
        handleAssign(bestRider._id);
    };

    const sortedRiders = [...riders].filter(r => {
        if (filter === 'available') return r.status === 'available';
        return true;
    }).sort((a, b) => {
        if (filter === 'rated') return (b.rating || 0) - (a.rating || 0);
        return 0;
    });

    if (loading) return (
        <RestaurantLayout>
            <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Scanning for available fleet...</p>
            </div>
        </RestaurantLayout>
    );

    return (
        <RestaurantLayout>
            <div className="max-w-3xl mx-auto space-y-8">
                {/* Header Section */}
                <div className="flex items-center justify-between bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                            <Users size={24} />
                         </div>
                         <div>
                            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Riders List</h1>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time Fleet Tracking</p>
                         </div>
                    </div>
                    <div className="relative">
                        <button 
                            onClick={() => setShowMenu(!showMenu)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${showMenu ? 'bg-primary text-white' : 'bg-slate-50 text-slate-400 hover:text-slate-600'}`}
                        >
                            <MoreHorizontal size={20} />
                        </button>

                        <AnimatePresence>
                            {showMenu && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                                    className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-[100]"
                                >
                                    <button onClick={() => { setFilter('all'); setShowMenu(false); fetchRiders(); }} className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary">Refresh Fleet</button>
                                    <button onClick={() => { setFilter('rated'); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary">Sort by Rating</button>
                                    <button onClick={() => { setFilter('available'); setShowMenu(false); }} className="w-full text-left px-4 py-2 text-xs font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 hover:text-primary">Available Only</button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Riders List */}
                <div className="space-y-4">
                    {sortedRiders.length === 0 ? (
                        <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100">
                             <Users size={48} className="mx-auto text-slate-200 mb-4" />
                             <p className="text-sm font-black text-slate-400 uppercase tracking-widest">No Riders Online</p>
                        </div>
                    ) : riders.map((rider, idx) => (
                        <motion.div
                            key={rider._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white rounded-[2.5rem] p-6 flex flex-col sm:flex-row items-center justify-between gap-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                        >
                            {/* Avatar + Primary Info */}
                            <div className="flex items-center gap-5 flex-1 w-full">
                                <div className="w-20 h-20 rounded-3xl overflow-hidden border-4 border-slate-50 shrink-0 bg-slate-100 flex items-center justify-center">
                                    {rider.profilePicture ? (
                                        <img src={rider.profilePicture} className="w-full h-full object-cover" alt={rider.name} />
                                    ) : (
                                        <Users className="text-slate-300" size={32} />
                                    )}
                                </div>
                                <div>
                                    <h3 className="text-lg font-black text-slate-900">{rider.name}</h3>
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <div className="flex items-center gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} size={12} fill={i < Math.floor(rider.rating || 5) ? 'currentColor' : 'none'} className={i < Math.floor(rider.rating || 5) ? 'text-orange-400' : 'text-slate-200'} />
                                            ))}
                                        </div>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase">({rider.reviewsCount || 0}+)</span>
                                    </div>
                                    <div className="flex items-center gap-3 mt-2">
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1">
                                            <MapPin size={12} className="text-primary" /> Kanodar Hub
                                        </span>
                                        <span className={`text-[10px] font-black uppercase tracking-widest flex items-center gap-1 ${rider.status === 'available' ? 'text-emerald-500' : 'text-slate-300'}`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${rider.status === 'available' ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
                                            {rider.status || 'offline'}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3 w-full sm:w-auto">
                                <button className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center hover:bg-primary/5 hover:text-primary transition-all">
                                    <Phone size={20} />
                                </button>
                                <button
                                    onClick={() => handleAssign(rider._id)}
                                    disabled={assigningId === rider._id || rider.status === 'busy'}
                                    className={`flex-1 sm:w-32 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all shadow-lg ${
                                        rider.status === 'available'
                                            ? 'bg-primary text-white shadow-primary/20 hover:scale-[1.05] active:scale-[0.95]'
                                            : 'bg-slate-100 text-slate-400 shadow-none cursor-not-allowed'
                                    }`}
                                >
                                    {assigningId === rider._id ? 'Assigning...' : rider.status === 'available' ? 'Assign' : 'Busy'}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Bottom Global Action */}
                <div className="pt-8">
                    <button 
                        onClick={handleAutoAssign}
                        className="w-full bg-slate-900 text-white py-6 rounded-[2rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-black transition-all group overflow-hidden relative"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-4">
                            Auto-Assign Best Match <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-primary/20 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500" />
                    </button>
                </div>
            </div>
        </RestaurantLayout>
    );
};

export default RidersList;

