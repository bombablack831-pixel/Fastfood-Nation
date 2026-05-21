import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, Clock, MapPin, ChevronRight, 
    CheckCircle2, AlertCircle, ShoppingBag, ArrowRight,
    Search, Filter
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const { data } = await api.get('/orders/my-orders');
                setOrders(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const getStatusStyle = (status) => {
        switch (status.toLowerCase()) {
            case 'delivered': return 'bg-green-50 text-green-600 border-green-100';
            case 'processing': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'pending': return 'bg-orange-50 text-[#FF4B3A] border-orange-100';
            case 'cancelled': return 'bg-red-50 text-red-500 border-red-100';
            default: return 'bg-gray-50 text-gray-500 border-gray-100';
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF4B3A] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-4xl mx-auto px-4 md:px-6 space-y-10">
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                            Mission <span className="text-[#FF4B3A] not-italic">Log.</span>
                        </h1>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Historical deployment data.</p>
                    </div>
                    <div className="flex gap-2">
                        <div className="relative flex-1 md:w-64">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search IDs..."
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 pl-12 pr-4 text-xs font-bold focus:bg-white focus:border-[#FF4B3A] focus:outline-none transition-all"
                            />
                        </div>
                        <button className="p-3 bg-gray-50 border border-gray-100 rounded-xl text-gray-400 hover:text-[#FF4B3A] transition-colors">
                            <Filter size={20} />
                        </button>
                    </div>
                </div>

                {/* Orders List */}
                {orders.length === 0 ? (
                    <div className="text-center py-20 space-y-6">
                        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto text-gray-300">
                            <Package size={48} />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-gray-900 uppercase italic">No deployment history</h3>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Start your first mission to populate this log.</p>
                        </div>
                        <button onClick={() => navigate('/')} className="btn-primary">Initialize Operation</button>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, idx) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                onClick={() => navigate(`/track/${order._id}`)}
                                className="p-6 rounded-[2.5rem] bg-white border border-gray-100 hover:border-orange-200 hover:shadow-xl transition-all cursor-pointer group"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                                    <div className="flex items-center gap-6">
                                        <div className="w-16 h-16 rounded-2xl bg-gray-50 flex items-center justify-center shrink-0 border border-gray-100">
                                            <ShoppingBag className="text-gray-400 group-hover:text-[#FF4B3A] transition-colors" size={24} />
                                        </div>
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID:</span>
                                                <span className="text-xs font-black text-gray-900 uppercase">#{order._id.slice(-8)}</span>
                                            </div>
                                            <h3 className="text-lg font-black text-gray-900 tracking-tight">
                                                {order.items?.length || 0} Assets Deployed
                                            </h3>
                                            <div className="flex items-center gap-4 pt-1">
                                                <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                                    <Clock size={12} /> {new Date(order.createdAt).toLocaleDateString()}
                                                </div>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black text-[#FF4B3A] tracking-tighter">
                                                    ₹{order.totalAmount}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-4 md:pt-0 border-gray-50">
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${getStatusStyle(order.status)}`}>
                                            {order.status}
                                        </div>
                                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-[#FF4B3A] group-hover:text-white transition-all">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
};

export default Orders;
