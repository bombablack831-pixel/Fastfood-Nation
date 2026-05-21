import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Zap, Clock, ArrowRight, Gift, ShieldCheck } from 'lucide-react';

const offers = [
  {
    id: 1,
    tag: 'First Order',
    title: '50% OFF',
    subtitle: 'On your very first order',
    description: 'New to Antigravity? Get 50% off on your first order, up to ₹150 discount.',
    code: 'WELCOME50',
    gradient: 'from-emerald-400 to-teal-500',
    icon: '🎉',
    expiry: 'Limited time offer',
  },
  {
    id: 2,
    tag: 'Free Delivery',
    title: 'FREE Delivery',
    subtitle: 'On orders above ₹500',
    description: 'Order over ₹500 and we\'ll deliver your food for FREE — any restaurant!',
    code: 'FREEDEL',
    gradient: 'from-violet-500 to-purple-600',
    icon: '🛵',
    expiry: 'Every day offer',
  },
  {
    id: 3,
    tag: 'Weekend Special',
    title: '30% OFF',
    subtitle: 'Saturday & Sunday only',
    description: 'Every weekend get a flat 30% discount on all orders. No minimum order value!',
    code: 'WEEKEND30',
    gradient: 'from-orange-400 to-red-500',
    icon: '🔥',
    expiry: 'Weekends only',
  },
  {
    id: 4,
    tag: 'Referral',
    title: '₹100 Credit',
    subtitle: 'Refer a friend & earn',
    description: 'Invite your friend. When they place their first order, you both get ₹100 wallet credit!',
    code: 'REFER100',
    gradient: 'from-amber-400 to-orange-500',
    icon: '🤝',
    expiry: 'No expiry',
  },
  {
    id: 5,
    tag: 'Flash Deal',
    title: '₹75 FLAT OFF',
    subtitle: 'Use before midnight',
    description: "Today's flash deal — ₹75 flat off on orders above ₹299. Don't miss it!",
    code: 'FLASH75',
    gradient: 'from-rose-500 to-pink-600',
    icon: '⚡',
    expiry: 'Expires tonight',
  },
];

const Offers = () => {
  const copyCode = (code) => {
    navigator.clipboard.writeText(code);
    const el = document.getElementById(`btn-${code}`);
    if (el) {
      el.textContent = 'Copied!';
      setTimeout(() => { el.textContent = code; }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 space-y-8">
        
        {/* Header */}
        <div className="text-center md:text-left space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">Offers & Deals</h1>
          <p className="text-sm font-medium text-slate-500">Premium savings, every day</p>
        </div>

        {/* Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-900 p-8 rounded-2xl relative overflow-hidden"
        >
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-violet-500/20 rounded-full blur-3xl" />
          </div>
          <div className="relative flex items-center justify-between gap-6">
            <div className="space-y-4">
              <span className="text-primary font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Zap size={14} fill="currentColor" /> Today's Best Deal
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">Get ₹200 Off<br/>Your Next Order</h2>
              <p className="text-slate-400 text-sm font-medium">On orders above ₹799. Use code below.</p>
              <div className="inline-block bg-white/10 border border-white/20 px-4 py-2 rounded-lg mt-2 font-mono font-bold text-white text-lg tracking-wide">
                PREMIUM200
              </div>
            </div>
            <div className="text-7xl flex-shrink-0 hidden sm:block opacity-90 drop-shadow-lg">🎁</div>
          </div>
        </motion.div>

        {/* Offers Grid */}
        <div className="space-y-4">
          {offers.map((offer, i) => (
            <motion.div
              key={offer.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm overflow-hidden group hover:shadow-md transition-shadow"
            >
              <div className={`h-1.5 bg-gradient-to-r ${offer.gradient}`} />
              <div className="p-5 sm:p-6 flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                <div className={`w-14 h-14 shrink-0 bg-gradient-to-br ${offer.gradient} rounded-2xl flex items-center justify-center text-2xl shadow-sm`}>
                  {offer.icon}
                </div>
                <div className="flex-1 min-w-0 w-full">
                  <div className="flex items-start justify-between gap-4 mb-1">
                    <div>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 mb-1">{offer.tag}</span>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">{offer.title}</h3>
                      <p className="text-sm font-bold text-primary mt-0.5">{offer.subtitle}</p>
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-slate-400 shrink-0 bg-slate-50 dark:bg-slate-700/50 px-2 py-1 rounded-md">
                      <Clock size={12} /> {offer.expiry}
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">{offer.description}</p>
                  <div className="flex items-center gap-3 pt-4">
                    <button
                      id={`btn-${offer.code}`}
                      onClick={() => copyCode(offer.code)}
                      className="bg-slate-50 dark:bg-slate-700/50 border border-dashed border-slate-300 dark:border-slate-600 px-4 py-2 rounded-lg font-mono font-bold text-sm text-slate-700 dark:text-slate-300 hover:border-primary hover:text-primary dark:hover:text-primary transition-colors cursor-pointer"
                    >
                      {offer.code}
                    </button>
                    <span className="text-xs font-medium text-slate-400">Tap to copy</span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 mt-8">
          <div className="p-3 bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 rounded-xl">
            <ShieldCheck size={28} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h3 className="font-bold text-slate-900 dark:text-white text-lg">All Deals Verified</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">All offers are tested and valid. Codes can be applied easily at checkout.</p>
          </div>
          <Link to="/" className="shrink-0 bg-primary text-white px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 hover:bg-primary/90 transition-colors">
            Order Now <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Offers;
