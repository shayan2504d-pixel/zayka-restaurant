import React from 'react';
import { Crown, Sparkles, Award, ShieldCheck, Heart, ChefHat } from 'lucide-react';

export default function AboutPage({ setActivePage }) {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Hero Narrative */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold" />
          <span>The Heritage of Grand ZAYKA</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text">
          Where Heritage Meets VIP Luxury
        </h1>
        <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
          ZAYKA Restaurant was born from a singular, uncompromising vision: to elevate traditional Mughlai, Continental, and Artisanal culinary arts into a world-class VIP fine dining realm.
        </p>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
        <div className="space-y-4 text-xs sm:text-sm text-stone-300 leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
            Our Culinary Philosophy
          </h2>
          <p>
            At ZAYKA, we believe true luxury lies in the purity of ingredients. We source hand-slaughtered prime Angus beef, organic tandoori poultry, 24-month aged Parmigiano Reggiano, and pure saffron imported directly from the valleys of Kashmir.
          </p>
          <p>
            Every cut of meat is marinated in age-old family spice blends, cooked over fragrant babool charcoal coals, or prepared in hand-built Italian wood-fired ovens. No shortcuts, no artificial enhancers—only pure, royal culinary precision.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-4">
            <div className="p-4 rounded-xl bg-stone-900 border border-gold/20 text-center">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mx-auto mb-1" />
              <p className="font-bold text-stone-100 text-xs">100% Certified Halal</p>
              <p className="text-[10px] text-stone-400">Strict hygiene protocols</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-900 border border-gold/20 text-center">
              <Award className="w-6 h-6 text-gold mx-auto mb-1" />
              <p className="font-bold text-stone-100 text-xs">Award-Winning Chefs</p>
              <p className="text-[10px] text-stone-400">Over 35+ years mastery</p>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl overflow-hidden glass-card border border-gold/30 shadow-2xl h-96">
          <img
            src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1000&q=80"
            alt="Zayka Interior"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />
          <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-dark-950/80 backdrop-blur-md border border-gold/30">
            <p className="font-serif text-sm font-bold text-stone-100">
              The Grand Clifton Residence
            </p>
            <p className="text-[11px] text-amber-300/80">
              Designed with Persian velvet, gold accents, and acoustic warmth.
            </p>
          </div>
        </div>
      </div>

      {/* Master Chef Showcase */}
      <div className="p-8 sm:p-12 rounded-3xl glass-vip border border-gold/30 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
        <div className="w-36 h-36 rounded-full overflow-hidden border-2 border-gold/50 shadow-gold-glow shrink-0">
          <img
            src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400&q=80"
            alt="Executive Chef"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 flex-1 text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <ChefHat className="w-5 h-5 text-gold" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
              Executive Chef & Culinary Director
            </span>
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl font-bold text-stone-100">
            Chef Mansoor Al-Bukhari
          </h3>
          <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-light">
            "Cooking for our esteemed guests is not simply preparing a meal—it is crafting an intimate, sensory royal performance. Every grain of rice in our Dum Biryani and every sear on our Wagyu beef carries centuries of culinary legacy."
          </p>
        </div>
      </div>
    </div>
  );
}
