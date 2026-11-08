import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import VIPBadge from '../components/VIPBadge';
import {
  Crown,
  Sparkles,
  ArrowRight,
  Flame,
  Star,
  Clock,
  ShieldCheck,
  Calendar,
  ShoppingBag,
  Award,
  ChevronRight,
  Phone,
  MessageCircle,
  MapPin,
  Heart
} from 'lucide-react';

export default function HomePage({ setActivePage }) {
  const { addToCart } = useCart();
  const { openAuth } = useAuth();

  const [specials, setSpecials] = useState([]);
  const [deals, setDeals] = useState([]);
  const [desserts, setDesserts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHomeData() {
      try {
        const [prodRes, dealRes, revRes] = await Promise.all([
          api.get('/products?special=1'),
          api.get('/deals'),
          api.get('/reviews')
        ]);

        if (prodRes.success) setSpecials(prodRes.products.slice(0, 6));
        if (dealRes.success) setDeals(dealRes.deals.slice(0, 3));
        if (revRes.success) setReviews(revRes.reviews.slice(0, 4));

        // Load desserts
        const desRes = await api.get('/products?dessert=1');
        if (desRes.success) setDesserts(desRes.products.slice(0, 4));
      } catch (err) {
        console.error('Failed to load home data', err);
      } finally {
        setLoading(false);
      }
    }
    loadHomeData();
  }, []);

  return (
    <div className="space-y-24 pb-20">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-12 pb-20">
        {/* Background Overlay & High-Res Luxury Food Imagery */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1544025162-d76694265947?w=1920&q=85"
            alt="VIP Dining Ambiance"
            className="w-full h-full object-cover opacity-25 scale-105 filter brightness-75 contrast-125"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/85 to-dark-950/70" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.08)_0,transparent_70%)]" />
        </div>

        {/* Content Container */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs sm:text-sm font-semibold shadow-gold-glow animate-pulse">
            <Crown className="w-4 h-4 text-gold" />
            <span>Welcome to Pakistan's Premier Fine Dining Destination</span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-stone-100 leading-[1.15]">
            Where Royal Flavor Meets <br className="hidden sm:inline" />
            <span className="gold-gradient-text">VIP Elegance</span>
          </h1>

          <p className="max-w-2xl mx-auto text-stone-300 text-sm sm:text-lg leading-relaxed font-light">
            Indulge in an extraordinary culinary journey featuring prime Gold Wagyu, wood-fired burrata pizzas, 24-hour slow-cooked mutton dum biryani, and artisanal desserts.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <button
              onClick={() => setActivePage('menu')}
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm sm:text-base hover:brightness-110 shadow-gold-glow-lg transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>Explore Royal Menu</span>
            </button>

            <button
              onClick={() => setActivePage('reservations')}
              className="px-8 py-4 rounded-xl glass-card hover:bg-stone-800 text-amber-300 font-bold text-sm sm:text-base border border-amber-500/40 hover:border-gold transition-all flex items-center gap-2.5 transform hover:-translate-y-0.5"
            >
              <Calendar className="w-5 h-5 text-gold" />
              <span>Book a VIP Table</span>
            </button>

            <button
              onClick={() => setActivePage('deals')}
              className="px-6 py-4 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-stone-200 font-semibold text-sm border border-stone-800 hover:border-gold/30 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Special Deals</span>
            </button>
          </div>

          {/* Quick Metrics Ribbon */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-12 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl glass-card border border-gold/10 text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-gold">4.9 ★</p>
              <p className="text-xs text-stone-400 mt-1">Over 2,500+ VIP Reviews</p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-gold/10 text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-gold">100%</p>
              <p className="text-xs text-stone-400 mt-1">Certified Halal Ingredients</p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-gold/10 text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-gold">30+</p>
              <p className="text-xs text-stone-400 mt-1">Master Chef Signatures</p>
            </div>

            <div className="p-4 rounded-2xl glass-card border border-gold/10 text-center">
              <p className="font-serif text-2xl sm:text-3xl font-bold text-gold">VIP</p>
              <p className="text-xs text-stone-400 mt-1">Private Lounges & Terrace</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. TODAY'S CHEF SPECIALS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Crown className="w-4 h-4" />
              <span>Curated Fine Dining</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
              Today's Chef Specials
            </h2>
          </div>
          <button
            onClick={() => setActivePage('menu')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 group"
          >
            <span>View Complete Menu</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {specials.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl glass-card overflow-hidden border border-gold/15 hover:border-gold/50 transition-all duration-300 flex flex-col group hover:shadow-gold-glow"
            >
              {/* Product Image */}
              <div className="relative h-56 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  <VIPBadge text="Chef Special" variant="gold" />
                  {product.discount_price && (
                    <VIPBadge text="Special Price" variant="red" />
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-dark-950/80 backdrop-blur-md border border-gold/30 text-amber-300 font-serif font-bold text-sm">
                  Rs. {(product.discount_price || product.price).toLocaleString()}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-100 group-hover:text-gold transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-stone-400 leading-relaxed mt-2 line-clamp-3">
                    {product.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    {product.discount_price ? (
                      <div className="flex items-center gap-2">
                        <span className="text-stone-500 line-through text-xs">
                          Rs. {product.price.toLocaleString()}
                        </span>
                        <span className="text-amber-400 font-bold text-sm">
                          Rs. {product.discount_price.toLocaleString()}
                        </span>
                      </div>
                    ) : (
                      <span className="text-amber-400 font-bold text-sm">
                        Rs. {product.price.toLocaleString()}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => addToCart(product, 1)}
                    className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-yellow-300 hover:text-dark-950 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. EXCLUSIVE DEALS & COMBOS BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl glass-vip border border-amber-500/30 p-8 sm:p-12 relative overflow-hidden">
          {/* Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 text-xs uppercase font-bold text-amber-400 tracking-wider mb-2">
                <Sparkles className="w-4 h-4 text-gold" />
                <span>Exclusive Savings & Packages</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
                Royal Deals & Signature Combos
              </h2>
              <p className="text-stone-300 text-xs sm:text-sm max-w-xl mt-2">
                Designed for discerning guests, royal family gatherings, and lavish celebrations. Enjoy up to 25% savings on our multi-course combos.
              </p>
            </div>

            <button
              onClick={() => setActivePage('deals')}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center gap-2 shrink-0"
            >
              <span>View All Deals</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Deals Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="rounded-2xl bg-dark-900/90 border border-gold/20 p-5 flex flex-col justify-between hover:border-gold/50 transition-all group"
              >
                <div>
                  <div className="relative h-44 rounded-xl overflow-hidden mb-4">
                    <img
                      src={deal.image}
                      alt={deal.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2 px-2.5 py-1 rounded-full bg-red-900/90 text-red-200 border border-red-500/40 text-[11px] font-bold">
                      {deal.badge || 'Special Deal'}
                    </div>
                  </div>

                  <h3 className="font-serif text-base font-bold text-stone-100 group-hover:text-gold transition-colors">
                    {deal.title}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1.5 leading-relaxed line-clamp-2">
                    {deal.description}
                  </p>

                  <div className="mt-3 p-2.5 rounded-lg bg-stone-900/80 border border-stone-800 text-[11px] text-stone-300">
                    <span className="text-amber-400 font-semibold">Includes: </span>
                    {deal.items_included}
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-stone-800 flex items-center justify-between">
                  <div>
                    <span className="text-stone-500 line-through text-xs block">
                      Rs. {deal.original_price.toLocaleString()}
                    </span>
                    <span className="font-serif text-lg font-bold text-amber-400">
                      Rs. {deal.deal_price.toLocaleString()}
                    </span>
                  </div>

                  <button
                    onClick={() => addToCart(deal, 1)}
                    className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-yellow-400 text-dark-950 font-bold text-xs transition-colors shadow-sm"
                  >
                    Order Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. DESSERTS & ARTISANAL ICE CREAM SPOTLIGHT */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Sweet Indulgence</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
              Artisanal Ice Cream & Royal Desserts
            </h2>
            <p className="text-stone-400 text-xs sm:text-sm mt-1">
              Hand-churned gelato, molten Belgian lava cakes, and royal saffron delicacies.
            </p>
          </div>
          <button
            onClick={() => setActivePage('desserts')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-amber-400 hover:text-amber-300 group"
          >
            <span>View All Desserts</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {desserts.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl glass-card border border-gold/15 overflow-hidden flex flex-col justify-between hover:border-gold/40 transition-all group"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&q=80';
                  }}
                />
                <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-full bg-dark-950/80 backdrop-blur-md text-[10px] text-amber-300 border border-gold/30">
                  Gourmet Sweet
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h4 className="font-serif text-sm font-bold text-stone-100 group-hover:text-gold transition-colors">
                    {item.name}
                  </h4>
                  <p className="text-[11px] text-stone-400 mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                  <span className="text-amber-400 font-bold text-sm">
                    Rs. {(item.discount_price || item.price).toLocaleString()}
                  </span>
                  <button
                    onClick={() => addToCart(item, 1)}
                    className="p-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-yellow-300 hover:text-dark-950 transition-colors"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TABLE RESERVATION VIP BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden border border-gold/30 p-8 sm:p-14 bg-gradient-to-r from-dark-950 via-stone-900 to-amber-950/40">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-yellow-300 text-xs font-semibold border border-amber-500/30">
              <Calendar className="w-3.5 h-3.5" />
              <span>Royal Concierge Service</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-5xl font-bold text-stone-100 leading-tight">
              Reserve Your Table in Our <br />
              <span className="gold-gradient-text">Private VIP Lounges</span>
            </h2>

            <p className="text-stone-300 text-xs sm:text-base leading-relaxed">
              Hosting a VIP banquet, anniversary dinner, or elite corporate gathering? Let our concierge prepare dedicated seating, floral decor, and bespoke chef menus tailored to your occasion.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActivePage('reservations')}
                className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center gap-2"
              >
                <Calendar className="w-4 h-4" />
                <span>Reserve Table Now</span>
              </button>

              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3.5 rounded-xl glass-card text-emerald-400 font-semibold text-sm border border-emerald-600/40 hover:bg-emerald-950/30 flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Inquiries</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 6. PATRON TESTIMONIALS & REVIEWS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest mb-2">
            <Award className="w-4 h-4" />
            <span>Royal Accolades</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
            Loved by Elite Patrons
          </h2>
          <p className="text-stone-400 text-xs sm:text-sm mt-2">
            Discover what esteemed guests have to say about the ZAYKA VIP dining experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl glass-card border border-gold/15 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-yellow-400">
                  {[...Array(rev.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-xs text-stone-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-yellow-300 text-dark-950 font-bold text-xs flex items-center justify-center">
                  {rev.customer_name ? rev.customer_name.charAt(0) : 'V'}
                </div>
                <div>
                  <p className="text-xs font-bold text-stone-100">{rev.customer_name}</p>
                  <p className="text-[10px] text-amber-400/80">Verified VIP Patron</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. CONTACT & LOCATION SUMMARY */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8 rounded-3xl glass-card border border-gold/20">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              Opening Hours & Timings
            </h3>
            <p className="text-xs text-stone-400">
              Open 7 days a week for royal lunch, high tea, and late-night dine-in.
            </p>
            <div className="space-y-2 text-xs text-stone-300 pt-2">
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span>Monday – Thursday:</span>
                <span className="text-amber-400 font-medium">12:00 PM – 01:00 AM</span>
              </div>
              <div className="flex justify-between border-b border-stone-800 pb-1.5">
                <span>Friday – Sunday:</span>
                <span className="text-amber-400 font-medium">12:00 PM – 02:30 AM</span>
              </div>
              <div className="flex justify-between pb-1">
                <span>VIP Home Delivery:</span>
                <span className="text-emerald-400 font-medium">12:00 PM – 02:00 AM</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              Direct Contact & Concierge
            </h3>
            <p className="text-xs text-stone-400">
              Call or message our concierge desk for table arrangements and takeaway.
            </p>
            <div className="space-y-2 pt-2">
              <a
                href="tel:+923001234567"
                className="flex items-center gap-2 text-xs text-stone-200 hover:text-gold"
              >
                <Phone className="w-4 h-4 text-gold" />
                <span>+92 300 1234567 (Toll-Free Direct)</span>
              </a>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-emerald-400 hover:underline"
              >
                <MessageCircle className="w-4 h-4" />
                <span>+92 300 1234567 (WhatsApp Quick Ordering)</span>
              </a>
              <div className="flex items-start gap-2 text-xs text-stone-300">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Plot 42, Royal Boulevard, Block 5, Clifton, Karachi</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center items-center text-center p-6 rounded-2xl bg-dark-900 border border-stone-800 space-y-4">
            <Crown className="w-8 h-8 text-gold animate-bounce" />
            <h4 className="font-serif text-base font-bold text-stone-100">
              Ready to Experience Royalty?
            </h4>
            <div className="flex gap-2 w-full">
              <button
                onClick={() => setActivePage('menu')}
                className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-yellow-400 text-dark-950 font-bold text-xs transition-colors"
              >
                Order Online
              </button>
              <button
                onClick={() => setActivePage('reservations')}
                className="flex-1 py-2.5 rounded-xl border border-amber-500/40 text-amber-300 hover:bg-amber-500/10 font-bold text-xs transition-colors"
              >
                Book Table
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
