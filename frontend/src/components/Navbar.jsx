import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, ShoppingCart, User, Menu, X, 
  MapPin, Bell, LogOut, Settings, History, 
  Heart, Sun, Moon, ChevronDown, Package
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import NotificationDropdown from './NotificationDropdown';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const menuItems = [
    { name: 'Home', path: '/' },
    { name: 'Restaurants', path: '/restaurants' },
    { name: 'Offers', path: '/offers' },
    { name: 'Support', path: '/support' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${
      isScrolled 
      ? 'py-3 bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xl shadow-slate-200/20' 
      : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between gap-8">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
              <Package size={22} />
            </div>
            <span className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
              FOOD<span className="text-primary not-italic">HUB</span>
            </span>
          </Link>

          {/* Location Picker (Desktop) */}
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-slate-50 dark:bg-slate-800 rounded-xl cursor-pointer hover:bg-slate-100 transition-colors border border-slate-100 dark:border-slate-700">
            <MapPin size={16} className="text-primary" />
            <span className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-slate-300">Kanodar, GJ</span>
            <ChevronDown size={14} className="text-slate-400" />
          </div>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search for 'Biryani' or 'Pizza'..." 
              className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-3 pl-12 pr-4 text-sm font-bold focus:ring-2 focus:ring-primary/20 transition-all dark:text-white placeholder:text-slate-400"
            />
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-3 md:gap-5">
            
            {/* Dark Mode Toggle */}
            <button 
              onClick={toggleDarkMode}
              className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all active:scale-90"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-600 dark:text-slate-400 hover:text-primary transition-all relative group active:scale-90"
              >
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-white dark:border-slate-800 group-hover:animate-ping" />
              </button>
              <AnimatePresence>
                {isNotificationsOpen && (
                  <div className="absolute top-full right-0 mt-4 w-80 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-100 dark:border-white/5 overflow-hidden origin-top-right">
                    <NotificationDropdown />
                  </div>
                )}
              </AnimatePresence>
            </div>

            {/* Cart */}
            <Link to="/cart" className="p-3 bg-slate-900 dark:bg-white rounded-xl text-white dark:text-slate-900 hover:bg-primary dark:hover:bg-primary hover:text-white transition-all relative active:scale-90 shadow-lg shadow-slate-900/10">
              <ShoppingCart size={20} />
              <span className="absolute -top-2 -right-2 bg-primary text-white text-[10px] font-black w-5 h-5 rounded-lg flex items-center justify-center border-2 border-white dark:border-slate-900">
                3
              </span>
            </Link>

            {/* User Profile / Auth */}
            {user ? (
              <div className="relative">
                <button 
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1.5 pr-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-slate-100 transition-all border border-slate-100 dark:border-slate-700"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-rose-500 flex items-center justify-center text-white font-black shadow-lg">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden lg:block text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Welcome</p>
                    <p className="text-xs font-black text-slate-900 dark:text-white">{user.name.split(' ')[0]}</p>
                  </div>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-white/5 py-4 z-50 overflow-hidden"
                    >
                      <div className="px-6 py-4 border-b border-slate-50 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 mb-2">
                        <p className="text-xs font-black text-slate-900 dark:text-white uppercase italic">{user.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 truncate">{user.email}</p>
                      </div>
                      
                      {[
                        { label: 'My Orders', icon: <History size={16} />, path: '/orders' },
                        { label: 'Favorites', icon: <Heart size={16} />, path: '/favorites' },
                        { label: 'Account', icon: <User size={16} />, path: '/profile' },
                        { label: 'Settings', icon: <Settings size={16} />, path: '/settings' },
                      ].map((item) => (
                        <Link 
                          key={item.label}
                          to={item.path} 
                          className="flex items-center gap-3 px-6 py-3 text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-xs font-black uppercase tracking-widest"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          {item.icon}
                          {item.label}
                        </Link>
                      ))}

                      <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-6 py-4 mt-2 text-rose-500 hover:bg-rose-50 transition-all text-xs font-black uppercase tracking-widest border-t border-slate-50 dark:border-white/5"
                      >
                        <LogOut size={16} />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link 
                  to="/login" 
                  className="px-6 py-3 text-xs font-black text-slate-600 dark:text-slate-300 uppercase tracking-widest hover:text-primary transition-all"
                >
                  Log In
                </Link>
                <Link 
                  to="/register" 
                  className="px-6 py-3 bg-primary text-white text-xs font-black uppercase tracking-widest rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-white active:scale-90 transition-transform"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed inset-0 top-[88px] bg-white dark:bg-slate-900 z-50 md:hidden"
          >
            <div className="p-6 space-y-8">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Search for food..." 
                  className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-2xl py-4 pl-12 pr-4 text-sm font-bold"
                />
              </div>

              {/* Navigation Links */}
              <div className="grid grid-cols-1 gap-4">
                {menuItems.map((item) => (
                  <Link 
                    key={item.name}
                    to={item.path} 
                    className="flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800 rounded-3xl"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span className="text-xl font-black text-slate-900 dark:text-white uppercase italic">{item.name}</span>
                    <div className="w-10 h-10 bg-white dark:bg-slate-700 rounded-full flex items-center justify-center text-primary shadow-sm">
                      <ChevronDown className="-rotate-90" size={20} />
                    </div>
                  </Link>
                ))}
              </div>

              {!user && (
                <div className="grid grid-cols-2 gap-4 pt-8">
                  <Link 
                    to="/login" 
                    className="flex items-center justify-center py-5 bg-slate-50 dark:bg-slate-800 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white"
                  >
                    Log In
                  </Link>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-center py-5 bg-primary text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-primary/20"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
