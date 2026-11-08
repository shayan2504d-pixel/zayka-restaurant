import React from 'react';
import { Crown, Phone, Mail, MapPin, MessageCircle, Clock, ShieldCheck, Heart } from 'lucide-react';

export default function Footer({ setActivePage }) {
  const handleNav = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-dark-950 border-t border-gold/20 pt-16 pb-8 text-stone-400 relative overflow-hidden">
      {/* Background Subtle Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-24 bg-gradient-to-b from-amber-500/5 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: Brand & Royalty */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-amber-600 to-amber-900 p-0.5 shadow-gold-glow">
                <div className="w-full h-full bg-dark-950 rounded-[10px] flex items-center justify-center">
                  <Crown className="w-5 h-5 text-yellow-400" />
                </div>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wider gold-gradient-text uppercase">
                  ZAYKA
                </span>
                <span className="block text-[10px] tracking-[0.25em] text-amber-200/60 uppercase">
                  Royal Culinary Art
                </span>
              </div>
            </div>

            <p className="text-xs leading-relaxed text-stone-400">
              Where culinary craftsmanship meets royal hospitality. Savor hand-cut Wagyu, wood-fired artisan pizzas, saffron dum biryani, and bespoke desserts in an elite VIP ambience.
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs text-yellow-300/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>100% Certified Hand-Slaughtered Halal</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-stone-100 mb-4 pb-2 border-b border-stone-800">
              Explore Elegance
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleNav('menu')} className="hover:text-gold transition-colors">
                  Full Royal Menu
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('deals')} className="hover:text-gold transition-colors">
                  Exclusive Deals & Combos
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('desserts')} className="hover:text-gold transition-colors">
                  Artisanal Ice Cream & Desserts
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('reservations')} className="hover:text-gold transition-colors">
                  VIP Lounge Table Reservation
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('tracking')} className="hover:text-gold transition-colors">
                  Live Order Tracker
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('gallery')} className="hover:text-gold transition-colors">
                  Interior & Dining Gallery
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Timings & Royal Concierge */}
          <div>
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-stone-100 mb-4 pb-2 border-b border-stone-800">
              Service Hours
            </h4>
            <div className="space-y-3 text-xs">
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-semibold">Lunch & High Tea</p>
                  <p className="text-stone-400">12:00 PM – 06:00 PM</p>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="text-stone-200 font-semibold">VIP Royal Dinner & Late Night</p>
                  <p className="text-stone-400">07:00 PM – 02:00 AM (7 Days)</p>
                </div>
              </div>
              <div className="pt-2">
                <a
                  href="https://wa.me/923001234567"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-600/40 text-emerald-400 text-xs font-medium hover:bg-emerald-900/60 transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  Order Direct via WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Col 4: Reach Us & Admin Portal */}
          <div>
            <h4 className="font-serif text-sm font-bold tracking-wider uppercase text-stone-100 mb-4 pb-2 border-b border-stone-800">
              Royal Location
            </h4>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>Plot 42, Royal Boulevard, Block 5, Clifton, Karachi, Pakistan</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-gold shrink-0" />
                <a href="tel:+923001234567" className="hover:text-gold">+92 300 1234567</a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-gold shrink-0" />
                <a href="mailto:vip@zaykarestaurant.com" className="hover:text-gold">vip@zaykarestaurant.com</a>
              </div>

              {/* Admin Portal Gateway Link */}
              <div className="pt-4 border-t border-stone-800/80">
                <button
                  onClick={() => handleNav('admin')}
                  className="text-[11px] text-amber-400/80 hover:text-amber-300 underline underline-offset-4 flex items-center gap-1.5"
                >
                  <span>Restaurant Owner / Staff Portal</span>
                  <Crown className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-stone-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© {new Date().getFullYear()} ZAYKA VIP Restaurant Platform. All Royal Rights Reserved.</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">Designed with VIP Precision & Royal Taste</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
