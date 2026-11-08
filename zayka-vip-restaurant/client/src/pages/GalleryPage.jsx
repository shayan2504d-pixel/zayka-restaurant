import React, { useState } from 'react';
import { Crown, Sparkles, Eye } from 'lucide-react';

export default function GalleryPage() {
  const [filter, setFilter] = useState('all');
  const [activeImage, setActiveImage] = useState(null);

  const galleryItems = [
    {
      id: 1,
      category: 'interior',
      title: 'The Sultan Private VIP Lounge',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1000&q=80',
      desc: 'Handcrafted velvet seating with gold crystal chandeliers'
    },
    {
      id: 2,
      category: 'food',
      title: 'Emperor 24k Gold Wagyu Burger',
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1000&q=80',
      desc: 'Prime Wagyu aged beef dusted in 24k edible gold leaf'
    },
    {
      id: 3,
      category: 'chef',
      title: 'Executive Chef Flame Plating',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1000&q=80',
      desc: 'Master Chef preparing tandoori char-grill masterpieces'
    },
    {
      id: 4,
      category: 'interior',
      title: 'Skyline Terrace Dining',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=1000&q=80',
      desc: 'Open sky panoramic views with romantic candlelight tables'
    },
    {
      id: 5,
      category: 'food',
      title: 'Woodfired Truffle Burrata Pizza',
      image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1000&q=80',
      desc: 'Oakwood fired oven crust topped with fresh burrata and Italian truffles'
    },
    {
      id: 6,
      category: 'food',
      title: 'Royal Mutton Dum Biryani Sealed Purdah',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=1000&q=80',
      desc: 'Slow cooked over charcoal with pure Kashmiri saffron'
    },
    {
      id: 7,
      category: 'events',
      title: 'Exclusive Banquet Celebration',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1000&q=80',
      desc: 'Hosting dignitaries, royal weddings, and corporate banquets'
    },
    {
      id: 8,
      category: 'food',
      title: 'Molten Belgian Chocolate Lava Sphere',
      image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=1000&q=80',
      desc: 'Valrhona flowing fondant with hand-scraped vanilla gelato'
    }
  ];

  const filtered = filter === 'all' ? galleryItems : galleryItems.filter(item => item.category === filter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold" />
          <span>The Visual Royal Chronicle</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text">
          Atmosphere & Gallery
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm">
          Immerse yourself in our majestic interior designs, culinary artistry, and unforgettable celebrations.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex justify-center gap-2">
        {['all', 'interior', 'food', 'chef', 'events'].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${
              filter === cat
                ? 'bg-amber-500 to-yellow-400 text-dark-950 border-gold shadow-gold-glow'
                : 'glass-card text-stone-400 border-stone-800 hover:text-white'
            }`}
          >
            {cat === 'all' ? 'All Chronicle' : cat}
          </button>
        ))}
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => setActiveImage(item)}
            className="group relative h-72 rounded-2xl overflow-hidden glass-card border border-gold/15 cursor-pointer hover:border-gold/60 transition-all duration-300"
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-5 flex flex-col justify-end">
              <span className="text-[10px] text-amber-400 font-bold uppercase tracking-wider">
                {item.category}
              </span>
              <h4 className="font-serif text-base font-bold text-stone-100">{item.title}</h4>
              <p className="text-xs text-stone-300 mt-1 line-clamp-2">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Modal */}
      {activeImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActiveImage(null)}
        >
          <div className="max-w-3xl w-full rounded-2xl overflow-hidden glass-vip border border-gold/40 shadow-2xl">
            <img
              src={activeImage.image}
              alt={activeImage.title}
              className="w-full max-h-[75vh] object-cover"
            />
            <div className="p-6 bg-dark-950">
              <h3 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
                {activeImage.title}
              </h3>
              <p className="text-xs text-stone-400 mt-1">{activeImage.desc}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
