import React, { useState, useEffect } from 'react';
import { api } from '../utils/api';
import { useCart } from '../context/CartContext';
import VIPBadge from '../components/VIPBadge';
import {
  Search,
  Flame,
  Plus,
  Minus,
  ShoppingBag,
  Sparkles,
  Filter,
  Check,
  Crown,
  X
} from 'lucide-react';

export default function MenuPage() {
  const { addToCart } = useCart();

  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [spicyFilter, setSpicyFilter] = useState('all'); // 'all' | 'spicy' | 'mild'
  const [specialsOnly, setSpecialsOnly] = useState(false);
  const [loading, setLoading] = useState(true);

  // Modal customization
  const [activeModalProduct, setActiveModalProduct] = useState(null);
  const [modalQuantity, setModalQuantity] = useState(1);
  const [modalInstructions, setModalInstructions] = useState('');

  useEffect(() => {
    async function loadMenu() {
      try {
        const [catsRes, prodsRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        if (catsRes.success) setCategories(catsRes.categories);
        if (prodsRes.success) setProducts(prodsRes.products);
      } catch (err) {
        console.error('Failed to load menu data', err);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Category match
    if (selectedCategory !== 'all') {
      if (product.category_slug !== selectedCategory && product.category_id !== selectedCategory) {
        return false;
      }
    }

    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = product.name.toLowerCase().includes(q);
      const matchDesc = product.description.toLowerCase().includes(q);
      const matchTags = (product.tags || '').toLowerCase().includes(q);
      if (!matchName && !matchDesc && !matchTags) return false;
    }

    // Specials filter
    if (specialsOnly && !product.is_special) {
      return false;
    }

    // Spicy level filter
    if (spicyFilter === 'spicy' && (!product.spicy_level || product.spicy_level === 0)) {
      return false;
    }
    if (spicyFilter === 'mild' && product.spicy_level > 1) {
      return false;
    }

    return true;
  });

  const handleOpenModal = (product) => {
    setActiveModalProduct(product);
    setModalQuantity(1);
    setModalInstructions('');
  };

  const handleConfirmAddToCart = () => {
    if (activeModalProduct) {
      addToCart(activeModalProduct, modalQuantity, modalInstructions);
      setActiveModalProduct(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Title & Introduction */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Crown className="w-3.5 h-3.5 text-gold" />
          <span>Haute Cuisine & Royal Recipes</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-extrabold text-stone-100 gold-gradient-text tracking-wide">
          The Royal Menu
        </h1>
        <p className="text-stone-400 text-xs sm:text-sm leading-relaxed">
          Every dish is meticulously curated with prime artisanal ingredients, authentic slow-cooking techniques, and regal presentation.
        </p>
      </div>

      {/* Search & Preference Filters Bar */}
      <div className="p-4 sm:p-5 rounded-2xl glass-card border border-gold/20 flex flex-col md:flex-row items-center gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by dish name, spice, or ingredient (e.g. Wagyu, Biryani, Truffle)..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs sm:text-sm focus:border-gold outline-none transition-all placeholder:text-stone-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-3 text-stone-400 hover:text-white text-xs"
            >
              Clear
            </button>
          )}
        </div>

        {/* Preference Filters */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setSpecialsOnly(!specialsOnly)}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              specialsOnly
                ? 'bg-amber-500/20 text-yellow-300 border-amber-500/50 shadow-sm'
                : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-gold" />
            <span>Chef Specials</span>
          </button>

          <button
            onClick={() => setSpicyFilter(spicyFilter === 'spicy' ? 'all' : 'spicy')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1.5 ${
              spicyFilter === 'spicy'
                ? 'bg-red-950/40 text-red-300 border-red-700/60 shadow-sm'
                : 'bg-stone-900/80 text-stone-400 border-stone-800 hover:text-stone-200'
            }`}
          >
            <Flame className="w-3.5 h-3.5 text-red-400" />
            <span>Spicy Delights</span>
          </button>
        </div>
      </div>

      {/* Category Pills Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 border-gold shadow-gold-glow'
              : 'glass-card text-stone-300 border-stone-800 hover:border-gold/30 hover:text-white'
          }`}
        >
          All Delicacies ({products.length})
        </button>

        {categories.map((cat) => {
          const isActive = selectedCategory === cat.slug || selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all border flex items-center gap-1.5 ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 border-gold shadow-gold-glow'
                  : 'glass-card text-stone-300 border-stone-800 hover:border-gold/30 hover:text-white'
              }`}
            >
              <span>{cat.name}</span>
            </button>
          );
        })}
      </div>

      {/* Products Grid */}
      {loading ? (
        <div className="py-20 text-center text-stone-400">
          <div className="w-10 h-10 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="font-serif text-sm">Preparing royal catalog...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center text-stone-400 rounded-3xl glass-card border border-stone-800">
          <p className="font-serif text-lg text-stone-200 mb-1">No delicacies matched your selection</p>
          <p className="text-xs text-stone-500 mb-4">Try clearing filters or searching for another dish.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
              setSpecialsOnly(false);
              setSpicyFilter('all');
            }}
            className="px-4 py-2 rounded-xl bg-amber-500/20 text-yellow-300 border border-amber-500/30 text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="rounded-2xl glass-card overflow-hidden border border-gold/15 hover:border-gold/50 transition-all duration-300 flex flex-col group hover:shadow-gold-glow"
            >
              {/* Product Image */}
              <div className="relative h-60 overflow-hidden cursor-pointer" onClick={() => handleOpenModal(product)}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                  {product.is_special ? <VIPBadge text="Chef Special" variant="gold" /> : null}
                  {product.discount_price ? <VIPBadge text="Discounted" variant="red" /> : null}
                  {product.spicy_level > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-red-950/80 text-red-400 border border-red-700/40 text-[10px] font-bold flex items-center gap-0.5">
                      <Flame className="w-3 h-3" />
                      {'🌶️'.repeat(product.spicy_level)}
                    </span>
                  )}
                </div>

                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-dark-950/85 backdrop-blur-md border border-gold/30 text-amber-300 font-serif font-bold text-sm">
                  Rs. {(product.discount_price || product.price).toLocaleString()}
                </div>
              </div>

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="cursor-pointer" onClick={() => handleOpenModal(product)}>
                  <div className="flex items-center justify-between text-[11px] text-amber-400/80 uppercase font-semibold mb-1">
                    <span>{product.category_name || 'Chef Specialty'}</span>
                    <span className="text-emerald-400">100% Halal</span>
                  </div>
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

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(product)}
                      className="px-3 py-2 rounded-xl bg-stone-800/80 hover:bg-stone-700 text-stone-300 text-xs font-semibold transition-colors"
                    >
                      Details
                    </button>
                    <button
                      onClick={() => addToCart(product, 1)}
                      className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500 text-yellow-300 hover:text-dark-950 border border-amber-500/40 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* DISH CUSTOMIZATION & DETAIL MODAL */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl glass-vip border border-gold/30 p-6 sm:p-8 shadow-2xl overflow-hidden">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-stone-400 hover:text-white bg-stone-900/60"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="relative h-48 rounded-xl overflow-hidden mb-5">
              <img
                src={activeModalProduct.image}
                alt={activeModalProduct.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-3 left-3">
                <VIPBadge text={activeModalProduct.category_name || 'Chef Dish'} variant="gold" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
                  {activeModalProduct.name}
                </h3>
                <p className="text-xs text-stone-300 leading-relaxed mt-2">
                  {activeModalProduct.description}
                </p>
              </div>

              {/* Special Instructions */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  Kitchen Notes / Special Requests (Optional)
                </label>
                <input
                  type="text"
                  value={modalInstructions}
                  onChange={(e) => setModalInstructions(e.target.value)}
                  placeholder="e.g. Less spicy, extra sauce, well-done, no onions"
                  className="w-full px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                />
              </div>

              {/* Quantity & Total */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-stone-400 block">Quantity</span>
                  <div className="flex items-center rounded-xl bg-stone-900 border border-stone-800 mt-1">
                    <button
                      onClick={() => setModalQuantity(Math.max(1, modalQuantity - 1))}
                      className="p-2 hover:text-amber-400 text-stone-300"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-stone-100">{modalQuantity}</span>
                    <button
                      onClick={() => setModalQuantity(modalQuantity + 1)}
                      className="p-2 hover:text-amber-400 text-stone-300"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] text-stone-400 block">Total</span>
                  <span className="font-serif text-lg font-bold text-amber-400">
                    Rs. {((activeModalProduct.discount_price || activeModalProduct.price) * modalQuantity).toLocaleString()}
                  </span>
                </div>
              </div>

              <button
                onClick={handleConfirmAddToCart}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add {modalQuantity} to Cart</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
