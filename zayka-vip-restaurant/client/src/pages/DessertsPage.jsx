import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import VIPBadge from '../components/VIPBadge';
import { Sparkles, ShoppingBag, Heart, Crown } from 'lucide-react';

export default function DessertsPage() {
  const { addToCart } = useCart();
  const [desserts, setDesserts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDesserts() {
      try {
        const res = await api.get('/products?dessert=1');
        if (res.success) setDesserts(res.products);
      } catch (err) {
        console.error('Failed to load desserts', err);
      } finally {
        setLoading(false);
      }
    }
    loadDesserts();
  }, []);

  const iceCreams = desserts.filter((d) => (d.category_slug || '').includes('ice') || (d.category_id || '').includes('ice'));
  const gourmetPastries = desserts.filter((d) => !iceCreams.some((ic) => ic.id === d.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-gold" />
          <span>The Confectionery Atelier</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text">
          Ice Cream & Gourmet Desserts
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Indulge in artisanal hand-churned gelato crafted with whole cream, decadent molten Valrhona cakes, and authentic saffron rabri desserts.
        </p>
      </div>

      {loading ? (
        <div className="py-20 text-center text-stone-400">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-sm">Chilling gourmet gelato...</p>
        </div>
      ) : (
        <div className="space-y-16">
          {/* Section A: Artisanal Gelato & Sundaes */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
              <Crown className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
                Artisanal Ice Creams & Sundaes
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {iceCreams.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl glass-card border border-gold/15 overflow-hidden flex flex-col justify-between hover:border-gold/40 transition-all group hover:shadow-gold-glow"
                >
                  <div className="relative h-52 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';
                      }}
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-0.5 rounded-full bg-dark-950/80 backdrop-blur-md text-[10px] text-amber-300 border border-gold/30">
                      Handcrafted
                    </div>
                  </div>

                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-100 group-hover:text-gold transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-400 mt-1 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                      <span className="text-amber-400 font-bold text-sm">
                        Rs. {(item.discount_price || item.price).toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-yellow-400 text-dark-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section B: Royal Warm Cakes & Patisserie */}
          <div className="space-y-6">
            <div className="flex items-center gap-3 border-b border-stone-800 pb-3">
              <Sparkles className="w-5 h-5 text-gold" />
              <h2 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
                Warm Fondants, Cheesecakes & Royal Pastries
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {gourmetPastries.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl glass-vip border border-gold/20 overflow-hidden flex flex-col justify-between hover:border-gold/50 transition-all group hover:shadow-gold-glow"
                >
                  <div className="relative h-60 overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(event) => {
                        event.currentTarget.onerror = null;
                        event.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';
                      }}
                    />
                    <div className="absolute top-3 left-3">
                      <VIPBadge text="House Specialty" variant="gold" />
                    </div>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h4 className="font-serif text-lg font-bold text-stone-100 group-hover:text-gold transition-colors">
                        {item.name}
                      </h4>
                      <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                      <span className="font-serif text-lg font-bold text-amber-400">
                        Rs. {(item.discount_price || item.price).toLocaleString()}
                      </span>
                      <button
                        onClick={() => addToCart(item, 1)}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs hover:brightness-110 shadow-gold-glow transition-all flex items-center gap-1.5"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add to Cart</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
