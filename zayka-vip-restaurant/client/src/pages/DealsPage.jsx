import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import VIPBadge from '../components/VIPBadge';
import { Sparkles, ShoppingBag, Clock, Check, Crown } from 'lucide-react';

export default function DealsPage() {
  const { addToCart } = useCart();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await api.get('/deals');
        if (res.success) setDeals(res.deals);
      } catch (err) {
        console.error('Failed to load deals', err);
      } finally {
        setLoading(false);
      }
    }
    loadDeals();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>Curated Royal Combos</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text">
          Exclusive Deals & Packages
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Lavish feasts paired with generous discounts. Perfect for grand family dinners, celebratory feasts, and intimate gourmet dates.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-400">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-sm">Loading royal combos...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {deals.map((deal) => {
            const savings = deal.original_price - deal.deal_price;
            const itemsList = (deal.items_included || '').split(',').map((s) => s.trim()).filter(Boolean);

            return (
              <div
                key={deal.id}
                className="rounded-3xl glass-vip border border-gold/25 p-6 sm:p-8 flex flex-col justify-between hover:border-gold/60 transition-all duration-300 group hover:shadow-gold-glow"
              >
                <div className="space-y-6">
                  {/* Image & Badges */}
                  <div className="relative h-64 rounded-2xl overflow-hidden">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

                    <div className="absolute top-3 left-3">
                      <VIPBadge text={deal.badge || 'Limited Edition Deal'} variant="gold" />
                    </div>

                    <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-emerald-950/85 border border-emerald-500/40 text-emerald-400 text-xs font-bold">
                      Save Rs. {savings.toLocaleString()}
                    </div>
                  </div>

                  {/* Info */}
                  <div>
                    <h3 className="font-serif text-2xl font-bold text-stone-100 group-hover:text-gold transition-colors">
                      {deal.title}
                    </h3>
                    <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                      {deal.description}
                    </p>
                  </div>

                  {/* Included Delicacies Checklist */}
                  <div className="p-4 rounded-xl bg-stone-900/80 border border-stone-800 space-y-2">
                    <p className="text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Crown className="w-3.5 h-3.5" />
                      What's Included in This Royal Feast:
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {itemsList.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-stone-200">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Price & Action */}
                <div className="pt-6 mt-6 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 line-through text-xs block">
                      Standard: Rs. {deal.original_price.toLocaleString()}
                    </span>
                    <span className="font-serif text-2xl font-bold text-amber-400">
                      Rs. {deal.deal_price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(deal, 1)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow transition-all flex items-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add Deal to Cart</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
