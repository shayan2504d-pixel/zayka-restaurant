import React from 'react';
import { useCart } from '../context/CartContext';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Store,
  Sparkles
} from 'lucide-react';

export default function CartDrawer({ setActivePage }) {
  const {
    isOpen,
    closeCart,
    items,
    orderType,
    setOrderType,
    updateQuantity,
    removeFromCart,
    subtotal,
    deliveryFee,
    total,
    clearCart
  } = useCart();

  if (!isOpen) return null;

  const freeDeliveryThreshold = 2000;
  const differenceToFree = Math.max(0, freeDeliveryThreshold - subtotal);
  const progressPercent = Math.min(100, (subtotal / freeDeliveryThreshold) * 100);

  const handleCheckoutClick = () => {
    closeCart();
    setActivePage('checkout');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-dark-950 border-l border-gold/30 h-full flex flex-col shadow-2xl z-10">
        {/* Header */}
        <div className="p-5 border-b border-stone-800/80 flex items-center justify-between bg-dark-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4 text-gold" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text">
                Your Royal Cart
              </h3>
              <p className="text-xs text-stone-400">
                {items.length} {items.length === 1 ? 'item' : 'items'} selected
              </p>
            </div>
          </div>

          <button
            onClick={closeCart}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Order Type Toggle */}
        <div className="px-5 pt-4 pb-2">
          <div className="grid grid-cols-2 p-1 rounded-xl bg-stone-900 border border-stone-800">
            <button
              onClick={() => setOrderType('delivery')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                orderType === 'delivery'
                  ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>VIP Delivery</span>
            </button>

            <button
              onClick={() => setOrderType('pickup')}
              className={`flex items-center justify-center gap-2 py-2 text-xs font-semibold rounded-lg transition-all ${
                orderType === 'pickup'
                  ? 'bg-amber-500/20 text-yellow-300 border border-amber-500/40 shadow-sm'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Pickup / Dine-In</span>
            </button>
          </div>

          {/* Free Delivery Banner */}
          {orderType === 'delivery' && (
            <div className="mt-3 p-2.5 rounded-xl bg-amber-950/20 border border-amber-500/25">
              <div className="flex items-center justify-between text-[11px] mb-1">
                <span className="text-stone-300 flex items-center gap-1 font-medium">
                  <Sparkles className="w-3 h-3 text-gold" />
                  {differenceToFree === 0
                    ? '🎉 You unlocked FREE Royal Delivery!'
                    : `Add Rs. ${differenceToFree.toFixed(0)} more for FREE Delivery!`}
                </span>
                <span className="font-bold text-amber-400">{progressPercent.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-stone-800 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-yellow-300 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 text-stone-500">
              <div className="w-16 h-16 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center mb-4">
                <ShoppingBag className="w-7 h-7 text-stone-600" />
              </div>
              <p className="font-serif text-base font-semibold text-stone-300 mb-1">
                Your cart is awaiting royal delicacies
              </p>
              <p className="text-xs text-stone-500 max-w-xs mb-6">
                Explore our signature wagyu burgers, artisan pizzas, and handcrafted desserts.
              </p>
              <button
                onClick={() => {
                  closeCart();
                  setActivePage('menu');
                }}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/40 text-xs font-semibold hover:bg-amber-500/30 transition-colors"
              >
                Browse Royal Menu
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-gold/30 transition-all flex gap-3 group"
              >
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=150'}
                  alt={item.name}
                  className="w-16 h-16 rounded-lg object-cover border border-stone-800 shrink-0"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <h4 className="text-xs font-bold text-stone-100 truncate">{item.name}</h4>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-stone-500 hover:text-red-400 transition-colors p-1"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <p className="text-xs font-semibold text-amber-400 mt-0.5">
                    Rs. {item.price.toLocaleString()}
                  </p>

                  {item.instructions && (
                    <p className="text-[10px] text-stone-400 italic truncate mt-0.5">
                      Note: {item.instructions}
                    </p>
                  )}

                  {/* Quantity Switcher */}
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center rounded-lg bg-stone-800 border border-stone-700">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 hover:text-amber-400 text-stone-300 transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-bold text-stone-100">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 hover:text-amber-400 text-stone-300 transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <span className="text-[11px] text-stone-400 ml-auto">
                      Subtotal: <span className="text-stone-200 font-semibold">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Summary & Checkout */}
        {items.length > 0 && (
          <div className="p-5 border-t border-stone-800/90 bg-dark-900/80 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal</span>
                <span className="text-stone-200 font-medium">Rs. {subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between text-stone-400">
                <span>VIP Delivery Charges</span>
                <span className={deliveryFee === 0 ? 'text-emerald-400 font-semibold' : 'text-stone-200 font-medium'}>
                  {deliveryFee === 0 ? 'FREE' : `Rs. ${deliveryFee}`}
                </span>
              </div>

              <div className="pt-2 border-t border-stone-800 flex justify-between text-sm font-bold text-stone-100">
                <span>Grand Total</span>
                <span className="text-amber-400 font-serif text-base">
                  Rs. {total.toLocaleString()}
                </span>
              </div>
            </div>

            <button
              onClick={handleCheckoutClick}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={clearCart}
              className="w-full text-center text-[11px] text-stone-500 hover:text-red-400 transition-colors"
            >
              Empty Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
