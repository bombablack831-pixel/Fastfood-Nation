import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, Plus, Minus, ShoppingBag, 
    ArrowRight, ChevronLeft, ChevronRight, CreditCard,
    Ticket, ShoppingCart
} from 'lucide-react';
import { useCart } from '../context/CartContext';

const Cart = () => {
    const { cartItems, addToCart, removeFromCart, clearCart } = useCart();
    const navigate = useNavigate();

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = subtotal + deliveryFee;

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center space-y-6">
                <div className="w-32 h-32 bg-orange-50 rounded-full flex items-center justify-center text-[#FF4B3A]">
                    <ShoppingBag size={64} />
                </div>
                <div className="space-y-2">
                    <h2 className="text-2xl font-black text-gray-900 uppercase italic">Your cart is empty</h2>
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Establish a link with a kitchen to start deployment.</p>
                </div>
                <button 
                    onClick={() => navigate('/')}
                    className="btn-primary"
                >
                    Browse Restaurants
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white pt-24 pb-32">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                
                <div className="flex flex-col lg:flex-row gap-12">
                    
                    {/* Cart Items List */}
                    <div className="flex-1 space-y-8">
                        <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase italic">
                                    Inventory <span className="text-[#FF4B3A] not-italic">Log.</span>
                                </h1>
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Review your selected assets.</p>
                            </div>
                            <button 
                                onClick={clearCart}
                                className="text-[10px] font-black text-red-500 uppercase tracking-widest hover:underline flex items-center gap-2"
                            >
                                <Trash2 size={14} /> Clear All
                            </button>
                        </div>

                        <div className="space-y-4">
                            <AnimatePresence>
                                {cartItems.map((item) => (
                                    <motion.div
                                        key={item._id}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="flex gap-4 md:gap-6 p-4 md:p-6 rounded-3xl bg-white border border-gray-100 hover:border-orange-200 transition-all group"
                                    >
                                        <div className="w-20 h-20 md:w-28 md:h-28 rounded-2xl overflow-hidden shrink-0 bg-gray-50">
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        </div>

                                        <div className="flex-1 flex flex-col justify-between">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-base md:text-xl font-black text-gray-900 tracking-tight">{item.name}</h3>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Unit Price: ₹{item.price}</p>
                                                </div>
                                                <span className="text-base md:text-xl font-black text-[#FF4B3A] tracking-tighter">₹{item.price * item.quantity}</span>
                                            </div>

                                            <div className="flex items-center justify-between pt-4">
                                                <div className="flex items-center gap-4 bg-orange-50 rounded-xl px-2 py-1 border border-orange-100">
                                                    <button 
                                                        onClick={() => removeFromCart(item._id)}
                                                        className="w-8 h-8 rounded-lg bg-white flex items-center justify-center text-[#FF4B3A] shadow-sm hover:bg-[#FF4B3A] hover:text-white transition-all"
                                                    >
                                                        <Minus size={16} />
                                                    </button>
                                                    <span className="text-sm font-black text-gray-900 w-4 text-center">{item.quantity}</span>
                                                    <button 
                                                        onClick={() => addToCart(item)}
                                                        className="w-8 h-8 rounded-lg bg-[#FF4B3A] flex items-center justify-center text-white shadow-lg hover:bg-orange-600 transition-all"
                                                    >
                                                        <Plus size={16} />
                                                    </button>
                                                </div>
                                                <button 
                                                    onClick={() => removeFromCart(item._id, true)}
                                                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Order Summary Sidebar */}
                    <div className="w-full lg:w-[400px] space-y-6">
                        <div className="bg-gray-50 rounded-[2.5rem] p-8 space-y-8 sticky top-24 border border-gray-100">
                            <h2 className="text-xl font-black text-gray-900 uppercase italic tracking-tight">Bill Details</h2>
                            
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Item Total</span>
                                    <span>₹{subtotal}</span>
                                </div>
                                <div className="flex justify-between items-center text-xs font-bold text-gray-500 uppercase tracking-widest">
                                    <span>Delivery Fee</span>
                                    <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                                        {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                                    </span>
                                </div>
                                <div className="h-px bg-gray-200 my-4" />
                                <div className="flex justify-between items-center">
                                    <span className="text-sm font-black text-gray-900 uppercase italic">To Pay</span>
                                    <span className="text-2xl font-black text-[#FF4B3A] tracking-tighter">₹{total}</span>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 group cursor-pointer hover:border-orange-200 transition-all">
                                    <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center text-[#FF4B3A]">
                                        <Ticket size={20} />
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Apply Coupon</p>
                                        <p className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">Save more on this order</p>
                                    </div>
                                    <ChevronRight size={16} className="text-gray-300 group-hover:text-[#FF4B3A]" />
                                </div>
                            </div>

                            <button 
                                onClick={() => navigate('/checkout')}
                                className="w-full btn-primary py-5 text-sm uppercase tracking-[0.2em]"
                            >
                                Proceed to Checkout
                                <ArrowRight size={20} />
                            </button>
                        </div>

                        <div className="p-6 bg-blue-50 rounded-3xl border border-blue-100 flex items-center gap-4">
                            <CreditCard className="text-blue-600" size={24} />
                            <p className="text-[9px] font-bold text-blue-800 uppercase tracking-widest leading-relaxed">
                                Safe and secure payments. <br /> 100% purchase protection.
                            </p>
                        </div>
                    </div>

                </div>

            </div>
        </div>
    );
};

export default Cart;
