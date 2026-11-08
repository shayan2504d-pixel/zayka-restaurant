import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import {
  Compass,
  Search,
  CheckCircle2,
  Clock,
  ChefHat,
  Truck,
  PackageCheck,
  AlertCircle,
  RefreshCw,
  Phone,
  MapPin,
  Crown
} from 'lucide-react';

export default function OrderTrackingPage({ initialOrderNumber }) {
  const [orderNumberInput, setOrderNumberInput] = useState(initialOrderNumber || 'ZYK-10942');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const fetchOrder = async (numberToFetch) => {
    if (!numberToFetch || !numberToFetch.trim()) return;
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await api.get(`/orders/track/${numberToFetch.trim()}`);
      if (res.success && res.order) {
        setOrderData(res.order);
      } else {
        setErrorMsg('Order not found. Please verify the order reference number.');
        setOrderData(null);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Could not locate order with that reference number.');
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderNumber) {
      setOrderNumberInput(initialOrderNumber);
      fetchOrder(initialOrderNumber);
    } else {
      fetchOrder('ZYK-10942'); // Load demo order initially
    }
  }, [initialOrderNumber]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchOrder(orderNumberInput);
  };

  // Status mapping
  const steps = [
    { key: 'pending', label: 'Order Received', desc: 'Awaiting kitchen reception', icon: Clock },
    { key: 'confirmed', label: 'Order Confirmed', desc: 'Ingredients prepared & approved', icon: CheckCircle2 },
    { key: 'preparing', label: 'Kitchen Preparation', desc: 'Master Chef is cooking your dish', icon: ChefHat },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'Rider dispatched in thermal pack', icon: Truck },
    { key: 'delivered', label: 'Delivered', desc: 'Enjoy your royal VIP feast', icon: PackageCheck }
  ];

  const getStepIndex = (status) => {
    if (status === 'ready') return 3; // 'ready' counts as almost out for delivery
    return steps.findIndex((s) => s.key === status);
  };

  const currentStepIndex = orderData ? getStepIndex(orderData.status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Compass className="w-3.5 h-3.5 text-gold" />
          <span>Real-Time Kitchen & Courier Radar</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
          Live Order Tracker
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Track the live progression of your meal from culinary preparation to direct dispatch.
        </p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearchSubmit} className="max-w-xl mx-auto">
        <div className="flex gap-2 p-2 rounded-2xl glass-card border border-gold/30">
          <input
            type="text"
            value={orderNumberInput}
            onChange={(e) => setOrderNumberInput(e.target.value.toUpperCase())}
            placeholder="Enter Order # (e.g. ZYK-10942)"
            className="flex-1 px-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-mono text-sm focus:border-gold outline-none"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            <span>Track</span>
          </button>
        </div>
      </form>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs text-center flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Tracking Card */}
      {orderData && (
        <div className="rounded-3xl glass-vip border border-gold/30 p-6 sm:p-10 space-y-8 shadow-2xl animate-in fade-in duration-300">
          {/* Header Info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-800 gap-4">
            <div>
              <span className="text-[11px] text-stone-400 block uppercase tracking-wider">
                Order Tracking Code
              </span>
              <h2 className="font-mono text-2xl font-bold text-amber-400 flex items-center gap-2">
                <span>{orderData.order_number}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/15 text-yellow-300 font-sans border border-amber-500/30 uppercase">
                  {orderData.status.replace(/_/g, ' ')}
                </span>
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => fetchOrder(orderData.order_number)}
                className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-gold/30 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Refresh Status"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Status</span>
              </button>
            </div>
          </div>

          {/* Visual 5-Stage Stepper */}
          <div className="space-y-4">
            <h3 className="text-xs uppercase font-bold text-amber-400 tracking-wider">
              Live Progress Pipeline
            </h3>

            <div className="relative">
              {/* Stepper Grid */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {steps.map((step, idx) => {
                  const Icon = step.icon;
                  const isCompleted = idx <= currentStepIndex;
                  const isCurrent = idx === currentStepIndex;

                  return (
                    <div
                      key={step.key}
                      className={`p-4 rounded-2xl border transition-all text-center flex flex-col items-center justify-center relative ${
                        isCurrent
                          ? 'bg-amber-500/15 border-gold shadow-gold-glow animate-pulse-glow'
                          : isCompleted
                          ? 'bg-stone-900/90 border-amber-500/40 text-stone-200'
                          : 'bg-stone-950/60 border-stone-800 text-stone-500 opacity-60'
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center mb-2.5 transition-colors ${
                          isCurrent
                            ? 'bg-gradient-to-br from-amber-500 to-yellow-400 text-dark-950 font-bold'
                            : isCompleted
                            ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/40'
                            : 'bg-stone-800 text-stone-500'
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                      </div>

                      <p
                        className={`text-xs font-bold leading-tight ${
                          isCurrent ? 'text-amber-300' : isCompleted ? 'text-stone-200' : 'text-stone-500'
                        }`}
                      >
                        {step.label}
                      </p>
                      <p className="text-[10px] text-stone-400 mt-1 line-clamp-2">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Order Details & Summary Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-800">
            {/* Delivery Destination Card */}
            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs">
              <p className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" />
                Delivery Information
              </p>
              <div className="space-y-1 text-stone-300">
                <p><span className="text-stone-500">Recipient:</span> {orderData.customer_name}</p>
                <p><span className="text-stone-500">Contact:</span> {orderData.customer_phone}</p>
                <p><span className="text-stone-500">Destination:</span> {orderData.address}</p>
                {orderData.notes && (
                  <p><span className="text-stone-500">Rider Note:</span> "{orderData.notes}"</p>
                )}
              </div>
            </div>

            {/* Financial Details Card */}
            <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2 text-xs">
              <p className="font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Crown className="w-3.5 h-3.5" />
                Payment & Invoice
              </p>
              <div className="space-y-1 text-stone-300">
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Mode:</span>
                  <span className="uppercase font-semibold text-stone-200">{orderData.payment_method}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Payment Status:</span>
                  <span className={`capitalize font-semibold ${orderData.payment_status === 'paid' ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {orderData.payment_status}
                  </span>
                </div>
                <div className="flex justify-between border-t border-stone-800 pt-1.5 font-bold">
                  <span>Grand Total:</span>
                  <span className="text-amber-400 text-sm">Rs. {orderData.total_amount.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Order Items Recap */}
            <div className="md:col-span-2 p-4 rounded-xl bg-stone-900/60 border border-stone-800 space-y-3">
              <p className="text-xs font-bold text-stone-300">Delicacies in this Order:</p>
              <div className="space-y-2">
                {orderData.items && orderData.items.map((it, idx) => (
                  <div key={idx} className="flex justify-between text-xs py-1 border-b border-stone-800/60 last:border-none">
                    <span className="text-stone-200 font-medium">
                      {it.quantity} × {it.product_name}
                      {it.instructions && <span className="text-[10px] text-stone-400 italic block">({it.instructions})</span>}
                    </span>
                    <span className="text-amber-400 font-semibold">
                      Rs. {(it.price * it.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
