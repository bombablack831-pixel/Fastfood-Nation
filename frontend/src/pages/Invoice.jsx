import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
    Download, Printer, ArrowLeft, CheckCircle2, 
    Hash, Calendar, User, MapPin, CreditCard,
    Package, Info, Zap, Landmark
} from 'lucide-react';
import { motion } from 'framer-motion';

const Invoice = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order for invoice:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) return (
        <div className="h-screen flex flex-col items-center justify-center gap-6">
            <div className="w-16 h-16 border-4 border-slate-900 border-t-transparent rounded-full animate-spin" />
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Generating Digital Bill</p>
        </div>
    );

    if (!order) return <div className="p-20 text-center uppercase font-black">Order Not Found</div>;

    const date = new Date(order.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });

    return (
        <div className="min-h-screen bg-white dark:bg-slate-900 transition-colors duration-300">
            <div className="max-w-4xl mx-auto pt-10 pb-32 px-6">
                {/* Header Controls */}
                <div className="flex justify-between items-center mb-12 no-print">
                    <button 
                        onClick={() => navigate('/orders')}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={16} /> Back to Orders
                    </button>
                    <div className="flex gap-4">
                        <button 
                            onClick={handlePrint}
                            className="bg-slate-900 dark:bg-emerald-500 text-white px-8 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-emerald-500 dark:hover:bg-emerald-400 transition-all shadow-xl shadow-slate-900/10"
                        >
                            <Printer size={16} /> Print / Save PDF
                        </button>
                    </div>
                </div>

                {/* Invoice Paper */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl border border-slate-100 dark:border-slate-700 overflow-hidden print:shadow-none print:border-none print:m-0"
                    id="invoice-content"
                >
                    {/* Invoice Header */}
                    <div className="bg-slate-900 text-white p-12 flex justify-between items-start border-b border-transparent dark:border-slate-700">
                        <div className="space-y-4">
                            <div className="flex items-center gap-2">
                                <Zap size={28} fill="#10b981" className="text-emerald-500" />
                                <h2 className="text-3xl font-black tracking-tighter uppercase font-mono">Antigravity</h2>
                            </div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.3em]">Tax Invoice / Bill of Supply</p>
                        </div>
                        <div className="text-right space-y-2">
                            <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                {order.paymentStatus === 'paid' ? 'Completed' : 'Payment Processing'}
                            </div>
                            <p className="text-white/40 text-[9px] font-bold uppercase tracking-widest italic">{date}</p>
                        </div>
                    </div>

                    <div className="p-12 space-y-16">
                        {/* Meta Data */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-widest mb-1">
                                    <Hash size={12} /> Order ID
                                </div>
                                <p className="text-xs font-black text-slate-900 dark:text-white uppercase">#{order._id.toUpperCase()}</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-widest mb-1">
                                    <User size={12} /> Customer
                                </div>
                                <div className="text-xs font-black text-slate-900 dark:text-white uppercase">
                                    <p>{order.customer.name}</p>
                                    <p className="text-[10px] text-slate-400 font-bold mt-1 lowercase">{order.customer.email}</p>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-widest mb-1">
                                    <MapPin size={12} /> Ship To
                                </div>
                                <p className="text-xs font-bold text-slate-600 dark:text-gray-400 leading-relaxed uppercase">{order.deliveryAddress}</p>
                            </div>
                        </div>

                        {/* Table */}
                        <div className="space-y-6">
                            <div className="flex justify-between items-center text-[10px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest pb-4 border-b-2 border-slate-50 dark:border-slate-700">
                                <div className="flex-[2]">Product Description</div>
                                <div className="flex-1 text-center">Qty</div>
                                <div className="flex-1 text-right">Price</div>
                                <div className="flex-1 text-right">Total</div>
                            </div>

                            {order.items.map((item, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-black text-slate-800 dark:text-gray-200 uppercase py-2">
                                    <div className="flex-[2] flex flex-col">
                                        <span>{item.food?.name}</span>
                                        <span className="text-[9px] text-slate-400 dark:text-gray-600 font-bold mt-0.5">HSN: 2106</span>
                                    </div>
                                    <div className="flex-1 text-center text-slate-400 dark:text-gray-600 font-bold">x{item.quantity}</div>
                                    <div className="flex-1 text-right text-slate-400 dark:text-gray-600 font-bold">₹{item.price}</div>
                                    <div className="flex-1 text-right dark:text-white">₹{item.price * item.quantity}</div>
                                </div>
                            ))}
                        </div>

                        {/* Calculations */}
                        <div className="flex flex-col md:flex-row justify-between items-start gap-12 pt-8 border-t border-slate-50 dark:border-slate-700">
                            <div className="max-w-xs space-y-6">
                                <div className="space-y-3">
                                    <h4 className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                                        <Landmark size={14} className="text-slate-300 dark:text-gray-600" />
                                        Restaurant Details
                                    </h4>
                                    <div className="text-[10px] font-bold text-slate-500 dark:text-gray-500 uppercase leading-relaxed">
                                        <p className="text-slate-900 dark:text-white font-black mb-1">{order.restaurant.name}</p>
                                        <p>{order.restaurant.address}</p>
                                        <p className="mt-2 text-emerald-500">GSTIN: 07AABCM1010A1Z1</p>
                                    </div>
                                </div>
                            </div>

                            <div className="w-full md:w-80 space-y-3">
                                <div className="flex justify-between text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                                    <span>Item Total</span>
                                    <span className="text-slate-900 dark:text-white">₹{order.subtotal || order.totalAmount - (order.taxPrice || 0) - (order.deliveryPrice || 0)}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                                    <span>Taxes & Fees (GST 5%)</span>
                                    <span className="text-slate-900 dark:text-white">₹{order.taxPrice || 0}</span>
                                </div>
                                <div className="flex justify-between text-[11px] font-black text-slate-400 dark:text-gray-500 uppercase tracking-widest">
                                    <span>Delivery Partner Fee</span>
                                    <span className="text-slate-900 dark:text-white">₹{order.deliveryPrice || 0}</span>
                                </div>
                                <div className="pt-6 mt-6 border-t-2 border-slate-900 dark:border-white flex justify-between items-end">
                                    <div className="space-y-1">
                                        <p className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Amount Paid</p>
                                        <h4 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter">₹{order.totalAmount}</h4>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[8px] font-black text-slate-300 dark:text-gray-600 uppercase tracking-widest">Payment</p>
                                        <p className="text-[10px] font-black text-slate-900 dark:text-white uppercase tracking-wider">{order.paymentMethod}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Footer Warning */}
                        <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 flex items-start gap-4">
                            <Info size={18} className="text-slate-400 shrink-0 mt-1" />
                            <p className="text-[9px] font-medium text-slate-500 dark:text-gray-500 leading-relaxed uppercase italic">
                                This is a computer generated invoice and does not require a physical signature. Returns or refunds are subject to our terms and conditions. For any queries, reach out to contact@antigravity.food
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-900 dark:bg-slate-700 h-2" />
                </motion.div>

                <style dangerouslySetInnerHTML={{ __html: `
                    @media print {
                        .no-print { display: none !important; }
                        body { background: white !important; margin: 0; padding: 0; }
                        .max-w-4xl { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; }
                        #invoice-content { border-radius: 0 !important; border: none !important; box-shadow: none !important; background: white !important; color: black !important; }
                        #invoice-content * { color: black !important; border-color: #eee !important; }
                        .bg-slate-900 { background-color: #111 !important; }
                        .text-white { color: white !important; }
                        .text-emerald-500 { color: #10b981 !important; }
                    }
                ` }} />
            </div>
        </div>
    );
};

export default Invoice;
