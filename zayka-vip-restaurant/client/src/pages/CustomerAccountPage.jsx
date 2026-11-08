import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  User,
  ShoppingBag,
  Calendar,
  Lock,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Compass,
  CheckCircle2,
  AlertCircle,
  Clock,
  Crown
} from 'lucide-react';

export default function CustomerAccountPage({ setActivePage, setTrackOrderNumber }) {
  const { user, logout, updateProfile, changePassword } = useAuth();

  const [activeTab, setActiveTab] = useState('orders'); // 'orders' | 'reservations' | 'profile' | 'security'
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [loadingReservations, setLoadingReservations] = useState(false);

  // Profile Form
  const [name, setName] = useState(user ? user.name : '');
  const [phone, setPhone] = useState(user ? user.phone || '' : '');
  const [address, setAddress] = useState(user ? user.address || '' : '');
  const [profileMsg, setProfileMsg] = useState('');

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passMsg, setPassMsg] = useState('');
  const [passError, setPassError] = useState('');

  useEffect(() => {
    if (user) {
      setName(user.name);
      setPhone(user.phone || '');
      setAddress(user.address || '');
      loadMyOrders();
      loadMyReservations();
    }
  }, [user]);

  const loadMyOrders = async () => {
    try {
      setLoadingOrders(true);
      const res = await api.get('/orders/my');
      if (res.success) setOrders(res.orders);
    } catch (err) {
      console.error('Failed to load orders', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const loadMyReservations = async () => {
    try {
      setLoadingReservations(true);
      const res = await api.get('/reservations/my');
      if (res.success) setReservations(res.reservations);
    } catch (err) {
      console.error('Failed to load reservations', err);
    } finally {
      setLoadingReservations(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setProfileMsg('');
    try {
      await updateProfile({ name, phone, address });
      setProfileMsg('Profile updated successfully.');
      setTimeout(() => setProfileMsg(''), 3000);
    } catch (err) {
      setProfileMsg(err.message || 'Failed to update profile.');
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPassMsg('');
    setPassError('');

    if (newPassword.length < 6) {
      setPassError('New password must be at least 6 characters.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPassError('New passwords do not match.');
      return;
    }

    try {
      const res = await changePassword(currentPassword, newPassword);
      setPassMsg(res.message || 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPassMsg(''), 3000);
    } catch (err) {
      setPassError(err.message || 'Current password incorrect.');
    }
  };

  const handleTrackClick = (orderNumber) => {
    if (setTrackOrderNumber) setTrackOrderNumber(orderNumber);
    setActivePage('tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Crown className="w-12 h-12 text-gold mx-auto" />
        <h2 className="font-serif text-2xl font-bold text-stone-100">VIP Authentication Required</h2>
        <p className="text-xs text-stone-400">Please sign in to view your orders, reservations, and profile.</p>
        <button
          onClick={() => setActivePage('home')}
          className="px-6 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs"
        >
          Return to Home
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Profile Header */}
      <div className="p-6 sm:p-8 rounded-3xl glass-vip border border-gold/25 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <img
            src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
            alt={user.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-gold/40 shadow-gold-glow"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
                {user.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/40 text-[10px] font-bold uppercase">
                {user.role === 'admin' ? 'Royal Admin' : 'VIP Patron'}
              </span>
            </div>
            <p className="text-xs text-stone-400 mt-1">{user.email || user.phone}</p>
          </div>
        </div>

        <button
          onClick={logout}
          className="px-4 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 text-xs font-semibold flex items-center gap-2 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-800 gap-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'orders'
              ? 'border-gold text-gold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>My Orders ({orders.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'reservations'
              ? 'border-gold text-gold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Calendar className="w-4 h-4" />
          <span>My Reservations ({reservations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'profile'
              ? 'border-gold text-gold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <User className="w-4 h-4" />
          <span>Profile Details</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center gap-2 transition-colors ${
            activeTab === 'security'
              ? 'border-gold text-gold'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>Password & Security</span>
        </button>
      </div>

      {/* TAB 1: ORDERS */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {loadingOrders ? (
            <div className="py-12 text-center text-stone-400">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Fetching past orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="py-16 text-center rounded-2xl glass-card border border-stone-800 space-y-3">
              <ShoppingBag className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="font-serif text-base font-bold text-stone-200">No Past Orders Found</p>
              <p className="text-xs text-stone-500">Order from our royal menu to experience VIP dining at home.</p>
              <button
                onClick={() => setActivePage('menu')}
                className="px-5 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs"
              >
                Browse Menu
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-2xl glass-card border border-gold/15 hover:border-gold/40 transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-stone-800 gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-bold text-amber-400">
                          {ord.order_number}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-yellow-300 border border-amber-500/30 text-[10px] font-semibold uppercase">
                          {ord.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-400 mt-0.5">
                        Placed on {new Date(ord.created_at).toLocaleDateString()} at{' '}
                        {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="font-serif text-base font-bold text-stone-100">
                        Rs. {ord.total_amount.toLocaleString()}
                      </span>
                      <button
                        onClick={() => handleTrackClick(ord.order_number)}
                        className="px-3.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-yellow-300 hover:text-dark-950 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5"
                      >
                        <Compass className="w-3.5 h-3.5" />
                        <span>Track Live</span>
                      </button>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="space-y-1.5 text-xs text-stone-300">
                    {ord.items && ord.items.map((it, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>
                          {it.quantity} × {it.product_name}
                        </span>
                        <span className="text-stone-400">
                          Rs. {(it.price * it.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-800/80 flex flex-wrap justify-between text-[11px] text-stone-400">
                    <span>Mode: <strong className="text-stone-200 capitalize">{ord.order_type}</strong></span>
                    <span>Payment: <strong className="text-stone-200 uppercase">{ord.payment_method}</strong> ({ord.payment_status})</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESERVATIONS */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          {loadingReservations ? (
            <div className="py-12 text-center text-stone-400">
              <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-xs">Loading table reservations...</p>
            </div>
          ) : reservations.length === 0 ? (
            <div className="py-16 text-center rounded-2xl glass-card border border-stone-800 space-y-3">
              <Calendar className="w-10 h-10 text-stone-600 mx-auto" />
              <p className="font-serif text-base font-bold text-stone-200">No Reservations Scheduled</p>
              <p className="text-xs text-stone-500">Book a table in our Skyline Rooftop or Royal VIP Lounge.</p>
              <button
                onClick={() => setActivePage('reservations')}
                className="px-5 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs"
              >
                Reserve a Table
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservations.map((res) => (
                <div
                  key={res.id}
                  className="p-5 rounded-2xl glass-card border border-gold/15 space-y-3"
                >
                  <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
                    <div>
                      <span className="font-mono text-sm font-bold text-amber-400">
                        {res.reservation_code}
                      </span>
                      <p className="text-[11px] text-stone-400">{res.seating_area}</p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500/15 text-yellow-300 border border-amber-500/30 text-[10px] font-semibold uppercase">
                      {res.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-stone-300">
                    <div>
                      <span className="text-stone-500 block">Date & Time:</span>
                      <span className="font-semibold text-stone-200">{res.reservation_date} at {res.reservation_time}</span>
                    </div>
                    <div>
                      <span className="text-stone-500 block">Guests:</span>
                      <span className="font-semibold text-stone-200">{res.guests_count} Guests</span>
                    </div>
                  </div>

                  {res.special_requests && (
                    <p className="text-[11px] text-stone-400 italic bg-stone-900/60 p-2 rounded-lg border border-stone-800">
                      "{res.special_requests}"
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: PROFILE FORM */}
      {activeTab === 'profile' && (
        <form onSubmit={handleUpdateProfile} className="max-w-xl p-6 rounded-3xl glass-vip border border-gold/25 space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text">
            Edit VIP Profile
          </h3>

          {profileMsg && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-300 text-xs">
              {profileMsg}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Phone Number</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Saved Home Delivery Address</label>
            <textarea
              rows="3"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="e.g. Apartment, House, Street, Area"
              className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none resize-none"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow"
          >
            Save Profile Changes
          </button>
        </form>
      )}

      {/* TAB 4: PASSWORD FORM */}
      {activeTab === 'security' && (
        <form onSubmit={handleChangePassword} className="max-w-xl p-6 rounded-3xl glass-vip border border-gold/25 space-y-4">
          <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text">
            Update Security Credentials
          </h3>

          {passMsg && (
            <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 text-xs">
              {passMsg}
            </div>
          )}

          {passError && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs">
              {passError}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">New Password (Min 6 chars)</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-300 mb-1">Confirm New Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow"
          >
            Update Password
          </button>
        </form>
      )}
    </div>
  );
}
