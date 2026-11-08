import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  Calendar,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Crown,
  Sparkles,
  Phone,
  Mail,
  User,
  MessageCircle
} from 'lucide-react';

export default function ReservationPage({ setActivePage }) {
  const { user } = useAuth();

  const [date, setDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });

  const [time, setTime] = useState('20:00');
  const [guests, setGuests] = useState(2);
  const [seatingArea, setSeatingArea] = useState('Royal VIP Lounge');
  const [occasion, setOccasion] = useState('Dinner Dining');
  const [customerName, setCustomerName] = useState(user ? user.name : '');
  const [customerPhone, setCustomerPhone] = useState(user ? user.phone || '' : '');
  const [customerEmail, setCustomerEmail] = useState(user ? user.email || '' : '');
  const [specialRequests, setSpecialRequests] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmedReservation, setConfirmedReservation] = useState(null);

  const seatingOptions = [
    { id: 'Royal VIP Lounge', desc: 'Plush velvet sofas, private chandelier ambience', icon: '👑' },
    { id: 'Skyline Rooftop Terrace', desc: 'Open-air panoramic views under the stars', icon: '✨' },
    { id: 'Garden Patio', desc: 'Lush greenery, water fountain, acoustic warmth', icon: '🌿' },
    { id: 'Executive Family Hall', desc: 'Spacious dining for family celebrations & kids', icon: '🥂' }
  ];

  const timeSlots = [
    '13:00', '14:00', '15:00', // Lunch
    '17:00', '18:00', // High Tea
    '19:30', '20:30', '21:30', '22:30', // Dinner
    '23:30', '00:30' // Late Night
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!customerName.trim() || !customerPhone.trim() || !date || !time) {
      setErrorMsg('Name, phone, date, and time are required.');
      return;
    }

    try {
      setIsSubmitting(true);
      const combinedNotes = `${occasion ? `Occasion: ${occasion}. ` : ''}${specialRequests ? specialRequests.trim() : ''}`;

      const res = await api.post('/reservations', {
        customer_name: customerName.trim(),
        customer_email: customerEmail.trim(),
        customer_phone: customerPhone.trim(),
        guests_count: guests,
        reservation_date: date,
        reservation_time: time,
        seating_area: seatingArea,
        special_requests: combinedNotes
      });

      if (res.success && res.reservation) {
        setConfirmedReservation(res.reservation);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit reservation.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedReservation) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center animate-in zoom-in-95 duration-300">
        <div className="rounded-3xl glass-vip border border-gold/40 p-8 sm:p-12 shadow-2xl space-y-6">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-yellow-300 text-dark-950 flex items-center justify-center mx-auto shadow-gold-glow animate-bounce">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-bold text-amber-400 tracking-widest">
              VIP Booking Registered
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-stone-100 gold-gradient-text">
              Table Reserved for {confirmedReservation.customer_name}
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md mx-auto">
              Our maître d' has scheduled your royal seating. We look forward to hosting you.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 text-left space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[11px] text-stone-400 block">Booking Reference</span>
                <span className="font-mono text-base font-bold text-amber-400">
                  {confirmedReservation.reservation_code}
                </span>
              </div>
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-yellow-300 border border-amber-500/30 text-xs font-semibold uppercase">
                {confirmedReservation.status}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-1">
              <div>
                <span className="text-stone-500 block">Date & Time:</span>
                <span className="text-stone-200 font-medium">
                  {confirmedReservation.reservation_date} at {confirmedReservation.reservation_time}
                </span>
              </div>
              <div>
                <span className="text-stone-500 block">Party Size:</span>
                <span className="text-stone-200 font-medium">{confirmedReservation.guests_count} Guests</span>
              </div>
              <div className="col-span-2">
                <span className="text-stone-500 block">Reserved Area:</span>
                <span className="text-amber-400 font-medium">{confirmedReservation.seating_area}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={() => setActivePage('account')}
              className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow"
            >
              View in My Account
            </button>
            <button
              onClick={() => {
                setConfirmedReservation(null);
                setActivePage('home');
              }}
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold" />
          <span>Royal Table Hospitality</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text">
          Reserve a VIP Table
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Select your preferred ambiance, date, and party size for a memorable royal evening.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Reservation Form */}
      <form onSubmit={handleSubmit} className="rounded-3xl glass-vip border border-gold/30 p-6 sm:p-10 space-y-8 shadow-2xl">
        {/* Step 1: Seating Area Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
            1. Select Seating Ambiance
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {seatingOptions.map((opt) => (
              <button
                type="button"
                key={opt.id}
                onClick={() => setSeatingArea(opt.id)}
                className={`p-4 rounded-xl border flex items-start gap-3 transition-all text-left ${
                  seatingArea === opt.id
                    ? 'bg-amber-500/15 border-gold text-yellow-300 shadow-sm ring-1 ring-gold/40'
                    : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                <span className="text-2xl">{opt.icon}</span>
                <div>
                  <p className="text-xs font-bold text-stone-100">{opt.id}</p>
                  <p className="text-[11px] text-stone-400 mt-0.5">{opt.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Date, Time & Guests */}
        <div className="space-y-3 pt-4 border-t border-stone-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
            2. Date, Time & Number of Guests
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Reservation Date</label>
              <input
                type="date"
                value={date}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Guests Count</label>
              <select
                value={guests}
                onChange={(e) => setGuests(parseInt(e.target.value))}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              >
                {[...Array(20)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1} {i === 0 ? 'Guest (Solo VIP)' : 'Guests'}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Occasion / Theme</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              >
                <option value="Dinner Dining">Dinner Dining</option>
                <option value="Birthday Celebration">Birthday Celebration</option>
                <option value="Anniversary">Anniversary</option>
                <option value="Corporate Banquet">Corporate Banquet</option>
                <option value="Romantic Date">Romantic Date</option>
              </select>
            </div>
          </div>

          {/* Time Slot Chips */}
          <div className="pt-2">
            <label className="block text-xs text-stone-400 mb-2">Available Time Slots</label>
            <div className="flex flex-wrap gap-2">
              {timeSlots.map((slot) => (
                <button
                  type="button"
                  key={slot}
                  onClick={() => setTime(slot)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                    time === slot
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 border-gold shadow-sm'
                      : 'bg-stone-900 text-stone-400 border-stone-800 hover:text-white'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step 3: Contact & Special Requests */}
        <div className="space-y-4 pt-4 border-t border-stone-800">
          <label className="block text-xs font-bold uppercase tracking-wider text-amber-400">
            3. Contact Details & Concierge Notes
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-stone-400 mb-1">Full Name *</label>
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
              <label className="block text-xs text-stone-400 mb-1">Phone Number (SMS confirmation) *</label>
              <input
                type="tel"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="e.g. +923219876543"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-stone-400 mb-1">Email Address</label>
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="e.g. patron@example.com"
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-stone-400 mb-1">
              Special Concierge Request (e.g. Candlelight setup, flower bouquets, dietary requirements)
            </label>
            <textarea
              rows="2"
              value={specialRequests}
              onChange={(e) => setSpecialRequests(e.target.value)}
              placeholder="Tell our hospitality team how we can make your evening unforgettable..."
              className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none resize-none"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow transition-all flex items-center justify-center gap-2"
        >
          {isSubmitting ? 'Confirming Royal Table...' : 'Submit VIP Table Reservation'}
        </button>
      </form>
    </div>
  );
}
