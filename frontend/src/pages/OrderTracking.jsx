import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Package, MapPin, Phone, MessageSquare, 
    ChevronLeft, Clock, ShieldCheck, Target,
    Navigation, Activity, Info, CheckCircle2,
    UtensilsCrossed, Bike, Store
} from 'lucide-react';
import api from '../utils/api';
import { socket, connectSocket } from '../utils/socket';
import LiveMap from '../components/LiveMap';
import { User as UserIcon } from 'lucide-react';

const OrderTracking = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [riderLocation, setRiderLocation] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!id || id === ':id') return;
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err) {
                console.error('Failed to fetch order:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();

        // Connect and join room
        const s = connectSocket();
        s.emit('join_order', id);

        s.on('status_update', (data) => {
            console.log('Status Update Received:', data);
            if (data.orderId === id) {
                setOrder(prev => ({ ...prev, status: data.status }));
            }
        });

        s.on('location_update', (data) => {
            if (data.orderId === id) {
                setRiderLocation(data.location);
            }
        });

        return () => {
            s.off('status_update');
            s.off('location_update');
        };
    }, [id]);

    const steps = [
        { status: 'placed', label: 'Order Placed', icon: <Package size={18} /> },
        { status: 'confirmed', label: 'Accepted', icon: <Store size={18} /> },
        { status: 'preparing', label: 'Preparing', icon: <UtensilsCrossed size={18} /> },
        { status: 'picked_up', label: 'Picked Up', icon: <Package size={18} /> },
        { status: 'out_for_delivery', label: 'On The Way', icon: <Bike size={18} /> },
        { status: 'delivered', label: 'Delivered', icon: <CheckCircle2 size={18} /> }
    ];

    const getCurrentStep = () => {
        const status = order?.status?.toLowerCase();
        const index = steps.findIndex(s => s.status === status);
        return index !== -1 ? index + 1 : 1;
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <div className="w-12 h-12 border-4 border-orange-100 border-t-[#FF4B3A] rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="min-h-screen bg-white pt-20 md:pt-24 pb-32">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Side: Map / Visual tracking */}
                    <div className="flex-1 space-y-6">
                        <div className="flex items-center justify-between mb-2">
                            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-[#FF4B3A] transition-colors">
                                <ChevronLeft size={16} /> Back to Hub
                            </button>
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-green-100 animate-pulse">
                                <Activity size={12} /> Live Link Active
                            </div>
                        </div>

                        <div className="aspect-video md:aspect-[21/9] bg-slate-900 rounded-[3rem] overflow-hidden border-4 border-slate-50 dark:border-slate-800 relative shadow-2xl group">
                            <LiveMap 
                                riderLocation={riderLocation}
                                restaurantLocation={order?.restaurant?.location?.coordinates ? {
                                    lat: order.restaurant.location.coordinates[1],
                                    lng: order.restaurant.location.coordinates[0]
                                } : null}
                                customerLocation={order?.deliveryLocation}
                                restaurantName={order?.restaurant?.name}
                                customerName={order?.customer?.name}
                            />
                            
                            {/* Scanning Overlay */}
                            <div className="absolute inset-0 pointer-events-none border-[1px] border-white/5 rounded-[3rem] overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-primary/5 to-transparent animate-pulse" />
                            </div>

                            {/* Telemetry HUD */}
                            <div className="absolute top-8 left-8 flex flex-col gap-2 pointer-events-none">
                                <div className="px-4 py-2 bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/10 flex items-center gap-3">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                                    <span className="text-[9px] font-black text-white uppercase tracking-widest">
                                        Status: {order?.status?.replace('_', ' ').toUpperCase()}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 space-y-4">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-[#FF4B3A] shadow-soft">
                                        <MapPin size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery To</p>
                                        <p className="text-sm font-black text-gray-900 leading-tight mt-1 uppercase italic tracking-tight">{order?.deliveryAddress}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 rounded-[2.5rem] bg-slate-900 border border-slate-800 space-y-4 overflow-hidden relative">
                                <div className="flex items-center gap-5 relative z-10">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center text-primary shadow-2xl">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Order ID</p>
                                        <p className="text-sm font-black text-white leading-tight mt-1 uppercase italic tracking-tight">
                                            ORD-{order?._id?.slice(-6).toUpperCase()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Side: Status Timeline */}
                    <div className="w-full lg:w-[380px] space-y-6">
                        <div className="bg-white rounded-[2.5rem] border border-gray-100 p-8 shadow-soft space-y-10">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight border-b border-gray-50 pb-4">Live Timeline</h2>
                            
                            <div className="space-y-8 relative">
                                {/* Vertical Line */}
                                <div className="absolute left-[23px] top-2 bottom-2 w-px bg-gray-100" />
                                
                                {steps.map((step, i) => {
                                    const active = i + 1 <= getCurrentStep();
                                    return (
                                        <div key={i} className={`flex items-center gap-6 relative z-10 ${active ? 'opacity-100' : 'opacity-30'}`}>
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                                                active ? 'bg-[#FF4B3A] text-white shadow-lg shadow-orange-500/20' : 'bg-gray-50 text-gray-300'
                                            }`}>
                                                {step.icon}
                                            </div>
                                            <div className="space-y-1">
                                                <p className="text-xs font-black text-gray-900 uppercase italic">{step.label}</p>
                                                <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                                    {active ? 'Verified' : 'Pending...'}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="pt-8 border-t border-gray-50">
                                <div className="p-6 bg-gray-50 rounded-3xl border border-gray-100 flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-[#FF4B3A] shadow-sm">
                                            <UserIcon size={24} />
                                        </div>
                                        <div>
                                            <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">Delivery Partner</p>
                                            <p className="text-xs font-black text-gray-900 uppercase italic">
                                                {order?.deliveryBoy?.name || 'Assigning...'}
                                            </p>
                                        </div>
                                    </div>
                                    {order?.deliveryBoy && (
                                        <div className="flex gap-2">
                                            <a href={`tel:${order.deliveryBoy.phone}`} className="w-10 h-10 rounded-xl bg-[#FF4B3A] text-white flex items-center justify-center shadow-lg hover:bg-orange-600 transition-all">
                                                <Phone size={18} />
                                            </a>
                                            <button className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center shadow-lg hover:bg-black transition-all">
                                                <MessageSquare size={18} />
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default OrderTracking;
