import React, { useState } from 'react';
import { Phone, Mail, MapPin, MessageCircle, Clock, Send, CheckCircle2, Crown } from 'lucide-react';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSent(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
    setTimeout(() => setSent(false), 5000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold" />
          <span>VIP Hospitality Concierge</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text">
          Connect With ZAYKA
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Whether planning an elite corporate banquet, customized catering, or VIP table inquiry, our concierge team is at your service.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Info Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-6 rounded-3xl glass-vip border border-gold/25 space-y-6 shadow-xl">
            <h3 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              Royal Concierge Coordinates
            </h3>

            <div className="space-y-4 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">VIP Sanctuary Location</p>
                  <p className="text-stone-400 mt-0.5">
                    Plot 42, Royal Boulevard, Block 5, Clifton, Karachi, Pakistan
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">VIP Telephone Reservations</p>
                  <a href="tel:+923001234567" className="text-amber-400 hover:underline">
                    +92 300 1234567 (Direct Concierge)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <MessageCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">WhatsApp Fast Concierge</p>
                  <a
                    href="https://wa.me/923001234567"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-400 hover:underline"
                  >
                    +92 300 1234567 (Click to Chat)
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">Electronic Correspondence</p>
                  <a href="mailto:vip@zaykarestaurant.com" className="text-amber-400 hover:underline">
                    vip@zaykarestaurant.com
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">Opening Hours</p>
                  <p className="text-stone-400">12:00 PM – 02:00 AM Daily (Mon – Sun)</p>
                </div>
              </div>
            </div>

            {/* Direct WhatsApp Callout Button */}
            <a
              href="https://wa.me/923001234567"
              target="_blank"
              rel="noreferrer"
              className="w-full py-3 rounded-xl bg-emerald-950/70 border border-emerald-600/50 text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-900/60 transition-colors shadow-sm"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat on WhatsApp Directly</span>
            </a>
          </div>

          {/* Interactive Map Mockup Card */}
          <div className="rounded-3xl glass-card border border-gold/15 p-5 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-200 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gold" />
                Clifton Block 5 Coordinates
              </span>
              <span className="text-[10px] text-amber-400">Valet Parking Available</span>
            </div>
            <div className="h-44 rounded-2xl bg-stone-900 border border-stone-800 relative overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?w=800&q=80"
                alt="Location Map View"
                className="w-full h-full object-cover filter brightness-50 contrast-125"
              />
              <div className="absolute p-3 rounded-xl bg-dark-950/90 border border-gold/40 text-center shadow-lg">
                <Crown className="w-5 h-5 text-gold mx-auto mb-1 animate-bounce" />
                <p className="font-serif text-xs font-bold text-stone-100">ZAYKA Restaurant</p>
                <p className="text-[9px] text-amber-300">Plot 42, Royal Boulevard</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form Column (7 cols) */}
        <div className="lg:col-span-7">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-10 rounded-3xl glass-vip border border-gold/25 space-y-5 shadow-2xl"
          >
            <h3 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
              Direct Inquiries & Banquet Requests
            </h3>
            <p className="text-stone-400 text-xs">
              Leave your coordinates and message below. Our Maître D’ will connect with you within 30 minutes.
            </p>

            {sent && (
              <div className="p-4 rounded-xl bg-emerald-950/60 border border-emerald-700 text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Thank you. Your inquiry has been received by our VIP Concierge team.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Your Full Name *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Syed Hamza Ali"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">Email Address *</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. patron@example.com"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">Subject / Occasion</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Corporate Banquet, Private Rooftop Booking, Feedback"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">Message *</label>
                <textarea
                  rows="4"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Share your requirements, date, or questions..."
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Message to Concierge</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
