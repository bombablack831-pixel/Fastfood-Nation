import React, { useState, useEffect, useRef } from 'react';
import RiderLayout from '../../layouts/RiderLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Navigation, MapPin, Phone, Store, 
    CheckCircle2, Clock, Map as MapIcon, 
    ChevronRight, Info
} from 'lucide-react';
import api from '../../utils/api';
import { toast } from 'react-toastify';
import LiveMap from '../../components/LiveMap';
import io from 'socket.io-client';

const socket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000');

const DEFAULT_LOCATION = { lat: 24.1030, lng: 72.3361 }; // Kanodar, Gujarat

const RiderTasks = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTask, setSelectedTask] = useState(null);
    const [riderLocation, setRiderLocation] = useState(DEFAULT_LOCATION);
    const tasksRef = useRef([]);
    const watchIdRef = useRef(null);
    const geoPermissionDenied = useRef(false);

    const fetchTasks = async () => {
        try {
            const { data } = await api.get('/orders/delivery/active');
            setTasks(data);
            tasksRef.current = data;
            if (data.length > 0 && !selectedTask) {
                setSelectedTask(data[0]);
            }
        } catch (err) {
            console.error('Failed to fetch tasks', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTasks();
        const interval = setInterval(fetchTasks, 30000);
        return () => clearInterval(interval);
    }, []);

    // Geolocation - runs only ONCE, uses tasksRef to avoid re-creating on tasks change
    useEffect(() => {
        if (!navigator.geolocation) return;
        if (geoPermissionDenied.current) return;

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                setRiderLocation(loc);
                
                // Emit location for all active tasks via ref (no stale closure)
                tasksRef.current.forEach(task => {
                    if (['picked_up', 'out_for_delivery'].includes(task.status)) {
                        socket.emit('update_location', {
                            orderId: task._id,
                            location: loc
                        });
                    }
                });
            },
            (err) => {
                if (err.code === 1) { // PERMISSION_DENIED
                    geoPermissionDenied.current = true;
                    if (watchIdRef.current !== null) {
                        navigator.geolocation.clearWatch(watchIdRef.current);
                        watchIdRef.current = null;
                    }
                    // Silently fall back to default - no repeated error spam
                }
            },
            { enableHighAccuracy: false, timeout: 10000, maximumAge: 30000 }
        );

        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []); // Empty deps - runs only once


    const handleUpdateStatus = async (orderId, status) => {
        try {
            await api.put(`/orders/${orderId}/status`, { status });
            toast.success(`Order marked as ${status.replace('_', ' ')}`);
            fetchTasks();
        } catch (err) {
            toast.error('Failed to update status');
        }
    };

    const getMapLocations = () => {
        if (!selectedTask) return null;
        
        const resCoord = selectedTask.restaurant?.location?.coordinates;
        return {
            center: riderLocation || (resCoord ? { lat: resCoord[1], lng: resCoord[0] } : { lat: 24.1030, lng: 72.3361 }),
            restaurant: resCoord ? { lat: resCoord[1], lng: resCoord[0] } : null,
            customer: selectedTask.deliveryLocation || null,
        };
    };

    const mapLocs = getMapLocations();

    if (loading) return (
        <RiderLayout>
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        </RiderLayout>
    );

    return (
        <RiderLayout>
            <div className="space-y-8">
                <header>
                    <h1 className="text-3xl font-black text-slate-900 tracking-tight italic uppercase">Active Task Console</h1>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mt-2 italic">Real-time mission parameters and navigation</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Task List */}
                    <div className="lg:col-span-4 space-y-4 max-h-[calc(100vh-250px)] overflow-y-auto no-scrollbar">
                        {tasks.length === 0 ? (
                            <div className="bg-white rounded-[2.5rem] p-12 text-center border border-slate-100 shadow-sm">
                                <Clock size={40} className="text-slate-200 mx-auto mb-4" />
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest italic">No active missions found</p>
                            </div>
                        ) : (
                            tasks.map((task) => (
                                <motion.div
                                    key={task._id}
                                    layoutId={task._id}
                                    onClick={() => setSelectedTask(task)}
                                    className={`bg-white rounded-[2rem] p-6 border-2 transition-all cursor-pointer ${
                                        selectedTask?._id === task._id ? 'border-primary shadow-xl shadow-primary/5' : 'border-transparent shadow-sm'
                                    }`}
                                >
                                    <div className="flex justify-between items-start mb-4">
                                        <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                            task.status === 'out_for_delivery' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'
                                        }`}>
                                            {task.status.replace('_', ' ')}
                                        </div>
                                        <span className="text-[10px] font-black text-slate-400 uppercase">#{task._id.slice(-6).toUpperCase()}</span>
                                    </div>
                                    <h3 className="font-black text-slate-900 truncate mb-1">{task.restaurant?.name}</h3>
                                    <p className="text-[10px] font-bold text-slate-400 italic truncate">{task.deliveryAddress}</p>
                                    <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-50">
                                        <span className="text-sm font-black text-slate-900 italic">₹{task.totalAmount}</span>
                                        <ChevronRight size={16} className={selectedTask?._id === task._id ? 'text-primary' : 'text-slate-300'} />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>

                    {/* Task Details & Map */}
                    <div className="lg:col-span-8 space-y-6">
                        {selectedTask ? (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={selectedTask._id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="space-y-6"
                                >
                                    {/* Mission Control Card */}
                                    <div className="bg-white rounded-[3rem] p-8 border border-slate-100 shadow-sm">
                                        <div className="flex flex-col md:flex-row justify-between gap-8 mb-10">
                                            <div className="space-y-6 flex-1">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shrink-0">
                                                        <Navigation size={22} />
                                                    </div>
                                                    <div>
                                                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1.5">Delivery To</h4>
                                                        <p className="text-xl font-black text-slate-900 tracking-tight">{selectedTask.customer?.name}</p>
                                                    </div>
                                                </div>

                                                <div className="space-y-4">
                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-primary shrink-0"><Store size={20} /></div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Pickup point</p>
                                                            <h5 className="font-black text-slate-800 leading-tight">{selectedTask.restaurant?.name}</h5>
                                                            <p className="text-[10px] font-bold text-slate-400 italic mt-1">{selectedTask.restaurant?.address}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-4">
                                                        <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-900 shrink-0"><MapPin size={20} /></div>
                                                        <div>
                                                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Drop-off point</p>
                                                            <h5 className="font-black text-slate-800 leading-tight">{selectedTask.customer?.name}</h5>
                                                            <p className="text-[10px] font-bold text-slate-400 italic mt-1">{selectedTask.deliveryAddress}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="md:w-64 space-y-4">
                                                <div className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest italic">Mission Value</span>
                                                        <Info size={12} className="text-slate-300" />
                                                    </div>
                                                    <p className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{selectedTask.totalAmount}</p>
                                                </div>
                                                
                                                <button className="w-full flex items-center justify-center gap-3 py-4 bg-white border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:border-primary/20 transition-all">
                                                    <Phone size={16} /> Emergency Contact
                                                </button>
                                                
                                                {selectedTask.status === 'picked_up' ? (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(selectedTask._id, 'delivered')}
                                                        className="w-full py-5 bg-slate-900 text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-slate-900/10 hover:bg-black transition-all"
                                                    >
                                                        ✅ Finalize Delivery
                                                    </button>
                                                ) : (
                                                    <button 
                                                        onClick={() => handleUpdateStatus(selectedTask._id, 'picked_up')}
                                                        className="w-full py-5 bg-primary text-white font-black text-[11px] uppercase tracking-[0.2em] rounded-2xl shadow-xl shadow-primary/20 hover:scale-[1.02] transition-all"
                                                    >
                                                        ▶ Initialize Pickup
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        <div className="h-80 rounded-[2.5rem] overflow-hidden border border-slate-100 shadow-inner relative">
                                            <LiveMap 
                                                riderLocation={riderLocation}
                                                center={mapLocs.center}
                                                restaurantLocation={mapLocs.restaurant}
                                                customerLocation={mapLocs.customer}
                                            />
                                            <div className="absolute top-6 left-6 bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                                                <MapIcon size={14} className="text-primary" /> Live Navigation Active
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </AnimatePresence>
                        ) : (
                            <div className="h-[500px] flex flex-col items-center justify-center bg-white rounded-[3rem] border border-slate-100 border-dashed text-slate-300">
                                <Navigation size={48} className="mb-4 opacity-20" />
                                <p className="text-[10px] font-black uppercase tracking-widest italic">Select a mission to view parameters</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </RiderLayout>
    );
};

export default RiderTasks;
