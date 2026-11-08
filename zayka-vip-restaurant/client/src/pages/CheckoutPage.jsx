import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import confetti from 'canvas-confetti';
import {
  ShoppingBag,
  Truck,
  Store,
  CreditCard,
  Banknote,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Crown,
  Compass,
  FileText
} from 'lucide-react';

export default function CheckoutPage({ setActivePage, setTrackOrderNumber }) {
  const { items, orderType, setOrderType, subtotal, deliveryFee, total, clearCart } = useCart();
  const { user } = useAuth();

  // Form Fields
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email || '' : '');
  const [customerPhone, setCustomerPhone] = useState(user ? user.phone || '' : '');
  const [address, setAddress] = useState(user ? user.address || '' : '');
  const [landmark, setLandmark] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod'); // 'cod' | 'card'

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  useEffect(() => {
    if (user) {
      if (!customerName) setCustomerName(user.name);
      if (!customerEmail) setCustomerEmail(user.email || '');
      if (!customerPhone) setCustomerPhone(user.phone || '');
      if (!address) setAddress(user.address || '');
    }
  }, [user]);

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your cart is empty. Please add items before placing an order.');
      return;
    }

    if (!customerName.trim() || !customerPhone.trim()) {
      setErrorMsg('Customer name and contact phone number are required.');
      return;
    }

    if (orderType === 'delivery' && !address.trim()) {
      setErrorMsg('Delivery address is required for VIP home delivery.');
      return;
    }

    try {
      setIsSubmitting(true);
      const fullAddress = orderType === 'delivery'
        ? `${address.trim()}${landmark ? ` (Near ${landmark.trim()})` : ''}`
        : 'Pickup / Dine-In at ZAYKA Restaurant, Clifton';

      const payload = {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        order_type: orderType,
        address: fullAddress,
        payment_method: paymentMethod,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          price: item.price,
          quantity: item.quantity,
          instructions: item.instructions || ''
        })),
        subtotal,
        discount: 0,
        delivery_fee: deliveryFee,
        total_amount: total,
        notes: notes.trim()
      };

      const res = await api.post('/orders', payload);

      if (res.success && res.order) {
        setConfirmedOrder(res.order);
        clearCart();

        // Trigger celebratory confetti
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTrackPlacedOrder = () => {
    if (confirmedOrder && setTrackOrderNumber) {
      setTrackOrderNumber(confirmedOrder.order_number);
      setActivePage('tracking');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (confirmedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in zoom-in-95 duration-300">
        <div className="rounded-3xl glass-vip border border-gold/40 p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-300 text-dark-950 flex items-center justify-center mx-auto shadow-gold-glow animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">
              Royal Order Confirmed
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
              Thank You, {confirmedOrder.customer_name}!
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
              Our master chefs have received your royal order. We are preparing every dish with utmost precision.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[11px] text-stone-400 block">Order Reference Number</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {confirmedOrder.order_number}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/30 text-xs font-semibold uppercase">
                {confirmedOrder.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-stone-500 block">Service Mode:</span>
                <span className="text-stone-200 font-medium capitalize">{confirmedOrder.order_type}</span>
              </div>
              <div>
                <span className="text-stone-500 block">Payment Method:</span>
                <span className="text-stone-200 font-medium uppercase">{confirmedOrder.payment_method}</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block">Destination:</span>
                <span className="text-stone-200 font-medium">{confirmedOrder.address}</span>
              </div>
              <div className="col-span-2 flex justify-between items-center pt-2 border-t border-stone-800">
                <span className="font-semibold text-stone-300">Total Charged:</span>
                <span className="font-serif text-base font-bold text-amber-400">
                  Rs. {confirmedOrder.total_amount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleTrackPlacedOrder}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Track Live Preparation</span>
            </button>

            <button
              onClick={() => setActivePage('home')}
              className="px-6 py-3.5 rounded-xl glass-card text-stone-300 hover:text-white text-xs sm:text-sm font-semibold border border-stone-800"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Title */}
      <div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
          Royal Checkout & Dispatch
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm mt-1">
          Review your selection and provide delivery coordinates for swift VIP service.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {items.length === 0 ? (
        <div className="py-20 text-center rounded-3xl glass-card border border-stone-800 space-y-4">
          <ShoppingBag className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="font-serif text-xl font-bold text-stone-200">Your Cart is Empty</h3>
          <p className="text-xs text-stone-500">Add delicacies from the menu to proceed with checkout.</p>
          <button
            onClick={() => setActivePage('menu')}
            className="px-6 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs"
          >
            Explore Menu
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Delivery & Customer Info (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Service Type Selector */}
            <div className="p-6 rounded-2xl glass-card border border-gold/15 space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold" />
                <span>1. Service Preference</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setOrderType('delivery')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    orderType === 'delivery'
                      ? 'bg-amber-500/15 border-gold text-yellow-300 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Truck className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-100">VIP Home Delivery</p>
                    <p className="text-[10px] text-stone-400">Insulated thermal box dispatched</p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setOrderType('pickup')}
                  className={`p-4 rounded-xl border flex items-center gap-3 transition-all text-left ${
                    orderType === 'pickup'
                      ? 'bg-amber-500/15 border-gold text-yellow-300 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Store className="w-5 h-5 text-gold shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-100">Dine-In / Pickup</p>
                    <p className="text-[10px] text-stone-400">Pick up ready at VIP counter</p>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Customer Contact Information */}
            <div className="p-6 rounded-2xl glass-card border border-gold/15 space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold" />
                <span>2. Patron Information</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Syed Hamza Ali"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Phone Number (Rider updates) *
                  </label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="e.g. +923219876543"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                    required
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    Email Address (for Digital Invoice)
                  </label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="e.g. patron@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                  />
                </div>
              </div>

              {orderType === 'delivery' && (
                <div className="space-y-4 pt-2 border-t border-stone-800">
                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Delivery Address & Street *
                    </label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. Suite 402, Al-Razi Heights, Clifton Block 5"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-300 mb-1">
                      Prominent Landmark (Optional)
                    </label>
                    <input
                      type="text"
                      value={landmark}
                      onChange={(e) => setLandmark(e.target.value)}
                      placeholder="e.g. Behind Ocean Mall, Near Bilawal Chowrangi"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Order & Kitchen Notes (Optional)
                </label>
                <textarea
                  rows="2"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Extra napkins, please call upon arrival, do not ring bell"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none resize-none"
                />
              </div>
            </div>

            {/* 3. Payment Method */}
            <div className="p-6 rounded-2xl glass-card border border-gold/15 space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-100 flex items-center gap-2">
                <Crown className="w-4 h-4 text-gold" />
                <span>3. Payment Selection</span>
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'bg-amber-500/15 border-gold text-yellow-300 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="sr-only"
                  />
                  <Banknote className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-100">
                      {orderType === 'delivery' ? 'Cash on Delivery' : 'Pay at Counter'}
                    </p>
                    <p className="text-[10px] text-stone-400">Pay when receiving food</p>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                    paymentMethod === 'card'
                      ? 'bg-amber-500/15 border-gold text-yellow-300 shadow-sm'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="sr-only"
                  />
                  <CreditCard className="w-5 h-5 text-amber-400 shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-stone-100">Credit / Debit Card</p>
                    <p className="text-[10px] text-stone-400">Card payment simulation</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Confirmation (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-vip border border-gold/30 sticky top-28 space-y-5 shadow-2xl">
              <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text flex items-center justify-between">
                <span>Order Summary</span>
                <span className="text-xs text-stone-400 font-sans font-normal">
                  {items.length} {items.length === 1 ? 'item' : 'items'}
                </span>
              </h3>

              {/* Items List */}
              <div className="max-h-60 overflow-y-auto space-y-3 pr-1">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 text-xs">
                    <img
                      src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                      alt={item.name}
                      className="w-12 h-12 rounded-lg object-cover border border-stone-800 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-stone-200 truncate">{item.name}</p>
                      <p className="text-[11px] text-stone-400">
                        Qty: {item.quantity} × Rs. {item.price.toLocaleString()}
                      </p>
                    </div>
                    <span className="font-semibold text-amber-400">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Calculation */}
              <div className="pt-4 border-t border-stone-800 space-y-2 text-xs">
                <div className="flex justify-between text-stone-400">
                  <span>Subtotal</span>
                  <span className="text-stone-200 font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>

                <div className="flex justify-between text-stone-400">
                  <span>VIP Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-emerald-400 font-semibold' : 'text-stone-200 font-medium'}>
                    {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                  </span>
                </div>

                <div className="pt-3 border-t border-stone-800 flex justify-between text-base font-bold text-stone-100">
                  <span>Grand Total</span>
                  <span className="font-serif text-xl font-bold text-amber-400">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <div className="w-5 h-5 border-2 border-dark-950 border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>Confirm & Place Royal Order</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <p className="text-[11px] text-center text-stone-500">
                Guaranteed freshness & hot delivery in pristine VIP packaging.
              </p>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
