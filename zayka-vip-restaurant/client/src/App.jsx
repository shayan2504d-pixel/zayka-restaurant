import React, { useState, useEffect } from 'react';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import CartDrawer from './components/CartDrawer';
import AuthModal from './components/AuthModal';

import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import DealsPage from './pages/DealsPage';
import DessertsPage from './pages/DessertsPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderTrackingPage from './pages/OrderTrackingPage';
import ReservationPage from './pages/ReservationPage';
import CustomerAccountPage from './pages/CustomerAccountPage';
import GalleryPage from './pages/GalleryPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

function AppContent() {
  const [activePage, setActivePage] = useState('home');
  const [trackOrderNumber, setTrackOrderNumber] = useState('');

  // Listen to hash changes if present
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash && ['home', 'menu', 'deals', 'desserts', 'reservations', 'tracking', 'gallery', 'about', 'contact', 'account', 'checkout', 'admin'].includes(hash)) {
        setActivePage(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSetActivePage = (page) => {
    setActivePage(page);
    window.location.hash = page;
  };

  return (
    <div className="min-h-screen flex flex-col bg-dark-950 text-stone-200">
      {/* VIP Navbar */}
      <Navbar activePage={activePage} setActivePage={handleSetActivePage} />

      {/* Main Content Area */}
      <main className="flex-1">
        {activePage === 'home' && <HomePage setActivePage={handleSetActivePage} />}
        {activePage === 'menu' && <MenuPage />}
        {activePage === 'deals' && <DealsPage />}
        {activePage === 'desserts' && <DessertsPage />}
        {activePage === 'checkout' && (
          <CheckoutPage
            setActivePage={handleSetActivePage}
            setTrackOrderNumber={setTrackOrderNumber}
          />
        )}
        {activePage === 'tracking' && (
          <OrderTrackingPage initialOrderNumber={trackOrderNumber} />
        )}
        {activePage === 'reservations' && (
          <ReservationPage setActivePage={handleSetActivePage} />
        )}
        {activePage === 'account' && (
          <CustomerAccountPage
            setActivePage={handleSetActivePage}
            setTrackOrderNumber={setTrackOrderNumber}
          />
        )}
        {activePage === 'gallery' && <GalleryPage />}
        {activePage === 'about' && <AboutPage setActivePage={handleSetActivePage} />}
        {activePage === 'contact' && <ContactPage />}
        {activePage === 'admin' && <AdminDashboardPage setActivePage={handleSetActivePage} />}
      </main>

      {/* Floating Elements & Modals */}
      <CartDrawer setActivePage={handleSetActivePage} />
      <AuthModal />

      {/* VIP Footer (Hidden on Admin for maximized space or visible on client) */}
      <Footer setActivePage={handleSetActivePage} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </AuthProvider>
  );
}
