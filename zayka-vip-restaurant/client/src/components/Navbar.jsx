import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  ShoppingBag,
  User,
  Phone,
  MessageCircle,
  Menu,
  X,
  Crown,
  Sparkles,
  Calendar,
  Compass,
  LogOut,
  ShieldAlert,
  ChevronDown
} from 'lucide-react';

export default function Navbar({ activePage, setActivePage }) {
  const { user, isAdmin, openAuth, logout } = useAuth();
  const { totalItems, openCart } = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'menu', label: 'Royal Menu' },
    { id: 'deals', label: 'Deals & Offers' },
    { id: 'desserts', label: 'Ice Cream & Desserts' },
    { id: 'reservations', label: 'Book VIP Table' },
    { id: 'tracking', label: 'Track Order' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'about', label: 'About Us' },
    { id: 'contact', label: 'Contact' },
  ];

  const handleNav = (id) => {
    setActivePage(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top VIP Announcement Bar */}
      <div className="bg-gradient-to-r from-dark-950 via-amber-950/40 to-dark-950 border-b border-amber-500/20 text-xs py-1.5 px-4 text-stone-300">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Crown className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span className="hidden sm:inline text-gold-light tracking-wide">
              Royal Dining Experience • 100% Certified Premium Halal
            </span>
            <span className="sm:hidden text-gold-light font-medium">ZAYKA VIP Lounge</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 hover:text-gold transition-colors text-emerald-400 font-medium"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp Order: +92 300 1234567</span>
              <span className="sm:hidden">WhatsApp</span>
            </a>
            <span className="text-stone-600">|</span>
            <a
              href="tel:+923001234567"
              className="flex items-center gap-1 hover:text-gold transition-colors"
            >
              <Phone className="w-3 h-3 text-gold" />
              <span className="hidden md:inline">VIP Concierge: 12 PM - 2 AM</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <div className="glass-vip border-b border-gold/15 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <button
            onClick={() => handleNav('home')}
            className="flex items-center gap-3 text-left group focus:outline-none"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-600 to-amber-900 p-0.5 shadow-[0_0_15px_rgba(212,175,55,0.4)] group-hover:shadow-[0_0_25px_rgba(212,175,55,0.7)] transition-all duration-300">
              <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                <Crown className="w-6 h-6 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="font-serif text-2xl font-bold tracking-wider gold-gradient-text uppercase leading-tight">
                ZAYKA
              </div>
              <div className="text-[10px] tracking-[0.25em] text-amber-200/70 uppercase font-sans">
                VIP Restaurant & Lounge
              </div>
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = activePage === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => handleNav(link.id)}
                  className={`px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 relative ${
                    isActive
                      ? 'text-gold bg-amber-500/10 font-semibold border border-gold/30 shadow-[0_0_10px_rgba(212,175,55,0.15)]'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-3">
            {/* Quick Track order pill on md screens */}
            <button
              onClick={() => handleNav('tracking')}
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-amber-300/90 hover:text-amber-200 border border-amber-500/30 rounded-full hover:bg-amber-500/10 transition-colors"
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Track Order</span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="relative p-2.5 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-200 border border-gold/20 hover:border-gold/50 shadow-md transition-all group"
              title="View Cart"
            >
              <ShoppingBag className="w-5 h-5 text-gold group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                  {totalItems}
                </span>
              )}
            </button>

            {/* User Account / Auth Section */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl bg-stone-900/90 border border-gold/30 hover:border-gold text-stone-200 transition-all text-left"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-7 h-7 rounded-lg object-cover border border-gold/40"
                  />
                  <div className="hidden sm:block text-xs">
                    <p className="font-semibold text-stone-100 max-w-[90px] truncate">{user.name}</p>
                    <p className="text-[10px] text-amber-400 font-serif tracking-wider uppercase">
                      {user.role === 'admin' ? 'Royal Admin' : 'VIP Patron'}
                    </p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
                </button>

                {/* Dropdown Menu */}
                {userDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-56 rounded-2xl glass-card py-2 shadow-2xl border border-gold/30 z-50 animate-in fade-in zoom-in-95 duration-150"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-stone-800 text-xs">
                      <p className="font-bold text-stone-100 truncate">{user.name}</p>
                      <p className="text-stone-400 truncate">{user.email || user.phone}</p>
                    </div>

                    <button
                      onClick={() => handleNav('account')}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-200 hover:text-gold hover:bg-stone-800/50 flex items-center gap-2.5 transition-colors"
                    >
                      <User className="w-4 h-4 text-gold" />
                      My Profile & Orders
                    </button>

                    <button
                      onClick={() => handleNav('reservations')}
                      className="w-full text-left px-4 py-2.5 text-xs text-stone-200 hover:text-gold hover:bg-stone-800/50 flex items-center gap-2.5 transition-colors"
                    >
                      <Calendar className="w-4 h-4 text-gold" />
                      Book / View Table
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => handleNav('admin')}
                        className="w-full text-left px-4 py-2.5 text-xs text-amber-300 font-semibold bg-amber-500/10 hover:bg-amber-500/20 flex items-center gap-2.5 transition-colors border-y border-amber-500/20"
                      >
                        <ShieldAlert className="w-4 h-4 text-amber-400" />
                        Admin Dashboard
                      </button>
                    )}

                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2.5 text-xs text-red-400 hover:bg-red-950/40 flex items-center gap-2.5 transition-colors mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 hover:brightness-110 shadow-[0_0_15px_rgba(212,175,55,0.35)] transition-all duration-200 flex items-center gap-1.5"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>VIP Login</span>
                </button>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden glass-vip border-b border-gold/20 py-4 px-6 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-stone-800">
            <button
              onClick={() => handleNav('reservations')}
              className="p-2.5 text-center text-xs font-semibold rounded-xl bg-amber-500/10 text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <Calendar className="w-4 h-4" />
              Reserve Table
            </button>
            <button
              onClick={() => handleNav('tracking')}
              className="p-2.5 text-center text-xs font-semibold rounded-xl bg-stone-800/70 text-stone-200 border border-stone-700 flex items-center justify-center gap-1.5"
            >
              <Compass className="w-4 h-4" />
              Track Order
            </button>
          </div>

          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNav(link.id)}
                className={`text-left px-3 py-2 text-sm rounded-lg transition-colors ${
                  activePage === link.id
                    ? 'text-gold font-bold bg-amber-500/15'
                    : 'text-stone-300 hover:text-white hover:bg-stone-800/40'
                }`}
              >
                {link.label}
              </button>
            ))}

            {isAdmin && (
              <button
                onClick={() => handleNav('admin')}
                className="text-left px-3 py-2 text-sm text-amber-300 font-bold bg-amber-950/40 border border-amber-600/30 rounded-lg mt-2 flex items-center gap-2"
              >
                <ShieldAlert className="w-4 h-4" />
                Admin Dashboard
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
