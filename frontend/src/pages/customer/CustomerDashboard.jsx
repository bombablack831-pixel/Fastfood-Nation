import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package, Clock, MapPin, Star, ChevronRight, Heart,
  ShoppingBag, Wallet, Bell, TrendingUp, Crown,
  ArrowRight, Eye, Repeat, Gift, Sparkles, Flame
} from 'lucide-react';
import CustomerLayout from '../../layouts/CustomerLayout';
import api from '../../utils/api';
import { useAuth } from '../../context/AuthContext';

const CustomerDashboard = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await api.get('/orders/my');
        setOrders(data);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchOrders();
  }, []);

  const activeOrders = orders.filter(o => !['delivered', 'cancelled'].includes(o.status));
  const pastOrders = orders.filter(o => o.status === 'delivered');
  const totalSpent = pastOrders.reduce((s, o) => s + (o.totalAmount || 0), 0);

  const statusMap = {
    placed: { label: 'Placed', color: 'text-blue-500', bg: 'bg-blue-50', dot: 'bg-blue-500' },
    confirmed: { label: 'Confirmed', color: 'text-indigo-500', bg: 'bg-indigo-50', dot: 'bg-indigo-500' },
    preparing: { label: 'Preparing', color: 'text-amber-500', bg: 'bg-amber-50', dot: 'bg-amber-500' },
    picked_up: { label: 'On the way', color: 'text-orange-500', bg: 'bg-orange-50', dot: 'bg-orange-500' },
    out_for_delivery: { label: 'Arriving', color: 'text-purple-500', bg: 'bg-purple-50', dot: 'bg-purple-500' },
    delivered: { label: 'Delivered', color: 'text-emerald-500', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', color: 'text-rose-500', bg: 'bg-rose-50', dot: 'bg-rose-500' },
  };

  if (loading) return (
    <CustomerLayout>
      <div className="flex flex-col items-center justify-center h-[50vh] gap-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Dashboard...</p>
      </div>
    </CustomerLayout>
  );

  return (
    <CustomerLayout>
      <div className="space-y-8">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-violet-500/10 rounded-full blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles size={14} className="text-yellow-400" />
              <span className="text-[10px] font-black text-yellow-400/80 uppercase tracking-widest">Welcome Back</span>
            </div>
            <h1 className="text-3xl lg:text-4xl font-black text-white tracking-tight mb-2">
              Hi, {user?.name?.split(' ')[0]}! <span className="text-primary">👋</span>
            </h1>
            <p className="text-white/50 font-medium text-sm max-w-md">
              Track your orders, explore new restaurants, and manage your food journey all in one place.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { label: 'Total Orders', value: orders.length, icon: <ShoppingBag size={16} />, color: 'from-primary to-rose-500' },
                { label: 'Amount Spent', value: `₹${totalSpent.toLocaleString()}`, icon: <Wallet size={16} />, color: 'from-emerald-500 to-teal-500' },
                { label: 'Active Now', value: activeOrders.length, icon: <Flame size={16} />, color: 'from-amber-500 to-orange-500' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/5 backdrop-blur-sm rounded-2xl p-4 border border-white/5">
                  <div className={`w-8 h-8 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white mb-3 shadow-lg`}>
                    {stat.icon}
                  </div>
                  <p className="text-xl font-black text-white leading-none mb-1">{stat.value}</p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: 'Favorites', icon: <Heart size={20} />, path: '/favorites', color: 'text-rose-500', bg: 'bg-rose-50' },
            { label: 'Wallet', icon: <Wallet size={20} />, path: '/wallet', color: 'text-emerald-500', bg: 'bg-emerald-50' },
            { label: 'Offers', icon: <Gift size={20} />, path: '/offers', color: 'text-purple-500', bg: 'bg-purple-50' },
            { label: 'FastPass', icon: <Crown size={20} />, path: '/fastpass', color: 'text-amber-500', bg: 'bg-amber-50' },
          ].map((action) => (
            <Link
              key={action.label}
              to={action.path}
              className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all text-center group"
            >
              <div className={`w-12 h-12 ${action.bg} rounded-2xl flex items-center justify-center ${action.color} mx-auto mb-2 group-hover:scale-110 transition-transform`}>
                {action.icon}
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">{action.label}</p>
            </Link>
          ))}
        </div>

        {/* Orders Section */}
        <div>
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm w-fit mb-6">
            {[
              { id: 'active', label: 'Active', count: activeOrders.length },
              { id: 'past', label: 'Past Orders', count: pastOrders.length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-md text-[9px] ${
                    activeTab === tab.id ? 'bg-white/20' : 'bg-primary/10 text-primary'
                  }`}>{tab.count}</span>
                )}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'active' ? (
              <motion.div
                key="active"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {activeOrders.length === 0 ? (
                  <div className="bg-white rounded-[2rem] p-12 border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="text-slate-200" size={36} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">No Active Orders</h3>
                    <p className="text-sm text-slate-400 font-medium mb-6">Your tummy is waiting! Order something delicious.</p>
                    <Link to="/" className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-primary/20">
                      Browse Restaurants <ArrowRight size={14} />
                    </Link>
                  </div>
                ) : (
                  activeOrders.map(order => {
                    const s = statusMap[order.status] || statusMap.placed;
                    return (
                      <Link
                        key={order._id}
                        to={`/track/${order._id}`}
                        className="block bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-primary/10 transition-all group"
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                              <img
                                src={order.items?.[0]?.food?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                                className="w-full h-full object-cover"
                                alt="Order"
                              />
                            </div>
                            <div>
                              <h3 className="font-black text-slate-900">{order.restaurant?.name || 'Restaurant'}</h3>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                                {order.items?.length} item{order.items?.length > 1 ? 's' : ''} · ₹{order.totalAmount}
                              </p>
                            </div>
                          </div>
                          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest ${s.bg} ${s.color}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${s.dot} animate-pulse`} />
                            {s.label}
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="relative h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{
                              width: order.status === 'placed' ? '15%'
                                : order.status === 'confirmed' ? '30%'
                                : order.status === 'preparing' ? '50%'
                                : order.status === 'picked_up' ? '70%'
                                : order.status === 'out_for_delivery' ? '85%'
                                : '100%'
                            }}
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary to-orange-500 rounded-full"
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock size={12} />
                            <span className="text-[10px] font-bold">Est. 18-22 min</span>
                          </div>
                          <div className="flex items-center gap-1 text-primary text-[10px] font-black uppercase tracking-wider group-hover:translate-x-1 transition-transform">
                            Track Order <ChevronRight size={12} />
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </motion.div>
            ) : (
              <motion.div
                key="past"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                {pastOrders.length === 0 ? (
                  <div className="bg-white rounded-[2rem] p-12 border border-slate-100 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Clock className="text-slate-200" size={36} />
                    </div>
                    <h3 className="text-lg font-black text-slate-900 mb-1">No Past Orders</h3>
                    <p className="text-sm text-slate-400 font-medium">Your order history will appear here.</p>
                  </div>
                ) : (
                  pastOrders.map(order => (
                    <div
                      key={order._id}
                      className="bg-white rounded-[2rem] p-6 border border-slate-100 shadow-sm hover:shadow-md transition-all"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden shrink-0">
                            <img
                              src={order.items?.[0]?.food?.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80'}
                              className="w-full h-full object-cover"
                              alt="Order"
                            />
                          </div>
                          <div>
                            <h3 className="font-black text-slate-900">{order.restaurant?.name || 'Restaurant'}</h3>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </p>
                          </div>
                        </div>
                        <p className="text-lg font-black text-slate-900">₹{order.totalAmount}</p>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {order.items?.slice(0, 3).map((item, i) => (
                          <span key={i} className="text-[10px] font-bold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                            {item.quantity}x {item.food?.name || 'Item'}
                          </span>
                        ))}
                        {order.items?.length > 3 && (
                          <span className="text-[10px] font-bold text-slate-400">+{order.items.length - 3} more</span>
                        )}
                      </div>

                      <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                        <Link
                          to={`/restaurant/${order.restaurant?._id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-primary/10"
                        >
                          <Repeat size={12} /> Reorder
                        </Link>
                        <Link
                          to={`/invoice/${order._id}`}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-slate-50 text-slate-600 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-100 transition-all border border-slate-100"
                        >
                          <Eye size={12} /> Invoice
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </CustomerLayout>
  );
};

export default CustomerDashboard;
