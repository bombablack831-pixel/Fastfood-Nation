import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    MapPin, CreditCard, ShieldCheck, 
    ChevronRight, ArrowRight, Wallet, 
    Plus, CheckCircle2, Lock, Info, Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import api from '../utils/api';
import { toast } from 'react-toastify';

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [loading, setLoading] = useState(true);
    const [placingOrder, setPlacingOrder] = useState(false);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryFee;

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                const { data } = await api.get('/addresses');
                setAddresses(data);
                if (data.length > 0) setSelectedAddress(data[0]);
            } catch (err) {
                console.error('Failed to fetch addresses:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAddresses();
    }, []);

    const handlePlaceOrder = async () => {
        if (!selectedAddress) {
            return toast.error('Please select a delivery address');
        }

        setPlacingOrder(true);
        try {
            // Find a valid restaurant reference from any item in the cart
            const itemWithRestaurant = cartItems.find(item => item.restaurant || item.restaurantId);
            const firstItem = itemWithRestaurant || cartItems[0] || {};
            
            let restaurantId = firstItem.restaurant?._id || firstItem.restaurantId || firstItem.restaurant;
            
            // If it's still missing, log the structure for debugging (the user will see the error toast)
            if (!restaurantId) {
                console.warn('[DEBUG] Cart Item Structure:', firstItem);
                return toast.error('Restaurant data is missing from cart items. Please try removing and re-adding items.');
            }

            const orderData = {
                items: cartItems.map(i => ({
                    food: i._id,
                    quantity: i.quantity,
                    price: i.price
                })),
                restaurant: String(restaurantId),
                deliveryAddress: selectedAddress.fullAddress,
                deliveryLocation: {
                    lat: Number(selectedAddress.location?.coordinates?.[1] || 24.103),
                    lng: Number(selectedAddress.location?.coordinates?.[0] || 72.336)
                },
                totalAmount: total,
                paymentMethod: paymentMethod,
                subtotal: subtotal,
                taxPrice: Math.round(subtotal * 0.05), // 5% GST
                deliveryPrice: deliveryFee
            };

            const { data } = await api.post('/orders/place', orderData);
            
            if (paymentMethod === 'online' && data.razorOrderId && !data.razorOrderId.startsWith('dummy_')) {
                // Real Razorpay integration would go here
                toast.info('Online payment initiated...');
                // ... Razorpay handler ...
                return;
            }

            toast.success('🚀 Order Placed Successfully!');
            clearCart();
            navigate(`/track/${data.order?._id || data._id}`);
        } catch (err) {
            console.error('Order Placement Error:', err);
            const errorMsg = err.response?.data?.message || err.response?.data?.error?.message || err.message || 'Failed to place order';
            toast.error(errorMsg);
        } finally {
            setPlacingOrder(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-white flex items-center justify-center">
            <Loader2 className="animate-spin text-primary" size={40} />
        </div>
    );

    return (
        <div className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-6xl mx-auto px-4 md:px-6">
                
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Left Side: Delivery & Payment Details */}
                    <div className="flex-1 space-y-10">
                        <div className="space-y-2">
                            <h1 className="text-3xl md:text-5xl font-black text-gray-900 tracking-tighter uppercase italic leading-none">
                                Final <span className="text-[#FF4B3A] not-italic">Briefing.</span>
                            </h1>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-2">Confirm destination and provisioning.</p>
                        </div>

                        {/* Delivery Address Section */}
                        <section className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={18} className="text-[#FF4B3A]" /> Delivery Terminal
                                </h2>
                                <button onClick={() => navigate('/addresses')} className="text-[10px] font-black text-[#FF4B3A] uppercase tracking-widest hover:underline">+ Manage Locations</button>
                            </div>
                            
                            {addresses.length === 0 ? (
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-[2rem] text-center">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">No terminals mapped</p>
                                    <button onClick={() => navigate('/addresses')} className="btn-primary py-3 px-6 text-[10px]">Initialize New Hub</button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 gap-4">
                                    {addresses.map((addr) => (
                                        <div 
                                            key={addr._id}
                                            onClick={() => setSelectedAddress(addr)}
                                            className={`p-6 rounded-3xl border-2 transition-all cursor-pointer relative overflow-hidden group ${
                                                selectedAddress?._id === addr._id 
                                                ? 'bg-orange-50 border-[#FF4B3A] shadow-lg shadow-orange-500/5' 
                                                : 'bg-white border-gray-100 hover:border-orange-100'
                                            }`}
                                        >
                                            {selectedAddress?._id === addr._id && (
                                                <div className="absolute top-4 right-6 text-green-600">
                                                    <CheckCircle2 size={24} />
                                                </div>
                                            )}
                                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-tight italic">{addr.label || 'Primary Hub'}</h3>
                                            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed max-w-[80%]">
                                                {addr.fullAddress}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                        {/* Payment Method Section */}
                        <section className="space-y-6">
                            <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard size={18} className="text-[#FF4B3A]" /> Secure Provisioning
                            </h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {[
                                    { id: 'card', label: 'Credit / Debit Card', icon: <CreditCard size={20} /> },
                                    { id: 'wallet', label: 'Digital Wallet', icon: <Wallet size={20} /> },
                                    { id: 'upi', label: 'UPI Protocol', icon: <Info size={20} /> },
                                    { id: 'cod', label: 'Cash on Delivery', icon: <ArrowRight size={20} /> },
                                ].map((method) => (
                                    <div 
                                        key={method.id}
                                        onClick={() => setPaymentMethod(method.id)}
                                        className={`p-6 rounded-2xl border-2 transition-all cursor-pointer flex items-center gap-4 ${
                                            paymentMethod === method.id 
                                            ? 'bg-orange-50 border-[#FF4B3A]' 
                                            : 'bg-white border-gray-100 hover:border-gray-200'
                                        }`}
                                    >
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                                            paymentMethod === method.id ? 'bg-[#FF4B3A] text-white' : 'bg-gray-50 text-gray-400'
                                        }`}>
                                            {method.icon}
                                        </div>
                                        <span className="text-[10px] font-black text-gray-900 uppercase tracking-widest">{method.label}</span>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    {/* Right Side: Order Summary */}
                    <div className="w-full lg:w-[400px]">
                        <div className="bg-gray-50 rounded-[3rem] p-8 space-y-8 sticky top-24 border border-gray-100 shadow-soft">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight border-b border-gray-200 pb-4">Extraction Summary</h2>
                            
                            <div className="space-y-4">
                                <div className="max-h-48 overflow-y-auto pr-2 no-scrollbar space-y-4">
                                    {cartItems.map((item) => (
                                        <div key={item._id} className="flex justify-between items-center">
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-gray-900 uppercase">{item.name}</span>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Qty: {item.quantity}</span>
                                            </div>
                                            <span className="text-xs font-black text-gray-900 tracking-tighter">₹{item.price * item.quantity}</span>
                                        </div>
                                    ))}
                                </div>
                                
                                <div className="h-px bg-gray-200 my-4" />
                                
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                        <span>Provision Total</span>
                                        <span>₹{subtotal}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em]">
                                        <span>Transit Fee</span>
                                        <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                                            {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center pt-2">
                                        <span className="text-sm font-black text-gray-900 uppercase italic">Final Total</span>
                                        <span className="text-2xl font-black text-[#FF4B3A] tracking-tighter">₹{total}</span>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handlePlaceOrder}
                                disabled={placingOrder || cartItems.length === 0}
                                className="w-full btn-primary py-6 text-sm uppercase tracking-[0.3em] shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed relative z-10"
                            >
                                {placingOrder ? (
                                    <Loader2 className="animate-spin" size={18} />
                                ) : (
                                    <>
                                        <Lock size={18} />
                                        Commit Order
                                        <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-[8px] font-black text-gray-400 uppercase tracking-widest">
                                <ShieldCheck size={12} className="text-green-600" /> End-to-end Encrypted Session
                            </div>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Checkout;
