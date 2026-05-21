import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate, useParams, Link } from 'react-router-dom';
import { Package, Bell } from 'lucide-react';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { CartProvider } from './context/CartContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

import RestaurantDetails from './pages/RestaurantDetails';
import Cart from './pages/Cart';
import Login from './pages/Login';
import Register from './pages/Register';
import OrderTracking from './pages/OrderTracking';
import Favorites from './pages/Favorites';
import AddressManager from './pages/AddressManager';
import AdminDashboard from './pages/AdminDashboard';
import UsersManagement from './pages/UsersManagement';
import RestaurantManagement from './pages/RestaurantManagement';
import OrdersManagement from './pages/OrdersManagement';
import CouponsManagement from './pages/CouponsManagement';
import Reports from './pages/Reports';
import DeliveryDashboard from './pages/DeliveryDashboard';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import FloatingCart from './components/FloatingCart';
import SearchPage from './pages/SearchPage';
import Offers from './pages/Offers';
import Notifications from './pages/Notifications';
import Checkout from './pages/Checkout';
import Invoice from './pages/Invoice';
import Unauthorized from './pages/Unauthorized';
import NotFound from './pages/NotFound';
import Wallet from './pages/Wallet';
import Fastpass from './pages/Fastpass';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import ChatWidget from './components/ChatWidget';
import RestaurantPartner from './pages/RestaurantPartner';
import DeliveryPartner from './pages/DeliveryPartner';
import RestaurantsPage from './pages/RestaurantsPage';
import MenuPage from './pages/MenuPage';
import ContactPage from './pages/ContactPage';

// Role Specific Sub-pages
import RestaurantAnalytics from './pages/restaurant/RestaurantAnalytics';
import RestaurantReviews from './pages/restaurant/RestaurantReviews';
import RestaurantEarnings from './pages/restaurant/RestaurantEarnings';
import RestaurantOrders from './pages/restaurant/RestaurantOrders';
import RestaurantMenu from './pages/restaurant/RestaurantMenu';
import RestaurantSettings from './pages/restaurant/RestaurantSettings';
import RiderEarnings from './pages/rider/RiderEarnings';
import RiderTasks from './pages/rider/RiderTasks';
import RiderAnalytics from './pages/rider/RiderAnalytics';
import RidersList from './pages/restaurant/RidersList';
import CustomerDashboard from './pages/customer/CustomerDashboard';

// Wrapper to conditionally show Navbar/BottomNav (hide on admin routes)
const AppShell = ({ children }) => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  const isDashboardRoute = location.pathname.startsWith('/dashboard');
  const isDeliveryRoute = location.pathname.startsWith('/delivery');
  const isAuthRoute = ['/login', '/register', '/join/restaurant', '/join/delivery'].includes(location.pathname);
  const isHomePage = location.pathname === '/';

  const hideNavigation = isAdminRoute || isAuthRoute || isDashboardRoute || isDeliveryRoute;

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)] overflow-x-hidden">
      {!hideNavigation && (
        <div className="hidden lg:block">
          <Navbar />
        </div>
      )}
      {!hideNavigation && (
        <div className="lg:hidden sticky top-0 z-[100] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border-b border-slate-100 dark:border-white/5 px-6 py-4 flex items-center justify-between shadow-xl shadow-slate-200/20">
           <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <Package className="text-white" size={18} />
              </div>
              <span className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase italic">FOOD<span className="text-primary not-italic">HUB</span></span>
           </Link>
           <div className="flex items-center gap-4">
              <div className="p-2 bg-slate-50 dark:bg-white/5 rounded-lg text-slate-400">
                <Bell size={20} />
              </div>
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-rose-500 border-2 border-white dark:border-slate-800 shadow-md" />
           </div>
        </div>
      )}
      <main className={`flex-grow ${!hideNavigation && !isHomePage ? 'container mx-auto px-4 py-6 md:py-8' : ''}`}>
        {children}
      </main>
      {!hideNavigation && <BottomNav />}
      {!hideNavigation && (
        <div className="lg:hidden">
           <FloatingCart />
        </div>
      )}
      <ChatWidget />
    </div>
  );
};

// Helper for legacy redirect
const TrackingRedirect = () => {
  const { id } = useParams();
  console.log('TrackingRedirect ID:', id);
  if (!id || id === ':id') {
    return <Navigate to="/orders" replace />;
  }
  return <Navigate to={`/track/${id}`} replace />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <AppShell>
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/restaurant/:id" element={<RestaurantDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/join/restaurant" element={<RestaurantPartner />} />
                <Route path="/join/delivery" element={<DeliveryPartner />} />
                <Route path="/search" element={<SearchPage />} />
                <Route path="/restaurants" element={<RestaurantsPage />} />
                <Route path="/menu" element={<MenuPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/offers" element={<Offers />} />

                {/* Customer Protected Routes */}
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
                <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
                <Route path="/invoice/:id" element={<ProtectedRoute><Invoice /></ProtectedRoute>} />
                <Route path="/track/:id" element={<ProtectedRoute><OrderTracking /></ProtectedRoute>} />
                <Route path="/order-tracking/:id" element={<ProtectedRoute><TrackingRedirect /></ProtectedRoute>} />
                <Route path='/favorites' element={<ProtectedRoute><Favorites /></ProtectedRoute>} />
                <Route path='/addresses' element={<ProtectedRoute><AddressManager /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/customer/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
                <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
                <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
                <Route path="/fastpass" element={<ProtectedRoute><Fastpass /></ProtectedRoute>} />

                {/* Owner Routes */}
                <Route path="/dashboard" element={<RoleRoute roles={['owner', 'restaurantOwner']}><Dashboard /></RoleRoute>} />
                <Route path="/dashboard/orders" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RestaurantOrders /></RoleRoute>} />
                <Route path="/dashboard/menu" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RestaurantMenu /></RoleRoute>} />
                <Route path="/dashboard/analytics" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RestaurantAnalytics /></RoleRoute>} />
                <Route path="/dashboard/earnings" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RestaurantEarnings /></RoleRoute>} />
                <Route path="/dashboard/reviews" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RestaurantReviews /></RoleRoute>} />
                <Route path="/dashboard/riders" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RidersList /></RoleRoute>} />
                <Route path="/dashboard/settings" element={<RoleRoute roles={['owner', 'restaurantOwner']}><RestaurantSettings /></RoleRoute>} />

                {/* Delivery Boy Routes */}
                <Route path='/delivery' element={<RoleRoute roles={['delivery', 'deliveryBoy']}><DeliveryDashboard /></RoleRoute>} />
                <Route path='/delivery/tasks' element={<RoleRoute roles={['delivery', 'deliveryBoy']}><RiderTasks /></RoleRoute>} />
                <Route path='/delivery/earnings' element={<RoleRoute roles={['delivery', 'deliveryBoy']}><RiderEarnings /></RoleRoute>} />
                <Route path='/delivery/analytics' element={<RoleRoute roles={['delivery', 'deliveryBoy']}><RiderAnalytics /></RoleRoute>} />

                {/* Admin Routes */}
                <Route path='/admin' element={<RoleRoute roles={['admin']}><AdminDashboard /></RoleRoute>} />
                <Route path='/admin/users' element={<RoleRoute roles={['admin']}><UsersManagement /></RoleRoute>} />
                <Route path='/admin/restaurants' element={<RoleRoute roles={['admin']}><RestaurantManagement /></RoleRoute>} />
                <Route path='/admin/orders' element={<RoleRoute roles={['admin']}><OrdersManagement /></RoleRoute>} />
                <Route path='/admin/coupons' element={<RoleRoute roles={['admin']}><CouponsManagement /></RoleRoute>} />
                <Route path='/admin/reports' element={<RoleRoute roles={['admin']}><Reports /></RoleRoute>} />

                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppShell>
            <ToastContainer
              position="top-right"
              autoClose={3000}
              theme="dark"
              toastStyle={{ background: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }}
            />
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
