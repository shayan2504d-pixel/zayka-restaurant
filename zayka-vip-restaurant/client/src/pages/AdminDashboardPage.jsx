import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../utils/api';
import {
  ShieldAlert,
  BarChart3,
  ShoppingBag,
  UtensilsCrossed,
  Tag,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  RefreshCw,
  LogOut,
  Crown,
  Search,
  Check,
  X,
  ArrowRight,
  TrendingUp,
  DollarSign
} from 'lucide-react';

export default function AdminDashboardPage({ setActivePage }) {
  const { user, isAdmin, login } = useAuth();

  // Admin Login states if not logged in as admin
  const [adminEmail, setAdminEmail] = useState('admin@zayka.com');
  const [adminPass, setAdminPass] = useState('admin123');
  const [loginError, setLoginError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // Active Admin Section
  // 'analytics' | 'orders' | 'products' | 'categories' | 'deals' | 'reservations' | 'customers' | 'reviews' | 'settings'
  const [activeSection, setActiveSection] = useState('analytics');

  // Data states
  const [metrics, setMetrics] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [deals, setDeals] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [settingsData, setSettingsData] = useState({});

  // Loading & Filter states
  const [loading, setLoading] = useState(false);
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [actionMsg, setActionMsg] = useState('');

  // Modals
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [dealModalOpen, setDealModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [orderDetailModal, setOrderDetailModal] = useState(null);

  // Form states for Product
  const [pName, setPName] = useState('');
  const [pDesc, setPDesc] = useState('');
  const [pPrice, setPPrice] = useState('');
  const [pDiscount, setPDiscount] = useState('');
  const [pCatId, setPCatId] = useState('');
  const [pImage, setPImage] = useState('');
  const [pSpicy, setPSpicy] = useState(0);
  const [pSpecial, setPSpecial] = useState(false);
  const [pDessert, setPDessert] = useState(false);
  const [pAvailable, setPAvailable] = useState(true);

  // Form states for Deal
  const [dTitle, setDTitle] = useState('');
  const [dDesc, setDDesc] = useState('');
  const [dItems, setDItems] = useState('');
  const [dOrigPrice, setDOrigPrice] = useState('');
  const [dDealPrice, setDDealPrice] = useState('');
  const [dImage, setDImage] = useState('');
  const [dBadge, setDBadge] = useState('');

  // Form states for Category
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');

  useEffect(() => {
    if (isAdmin) {
      loadDashboardData();
    }
  }, [isAdmin, activeSection]);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      if (activeSection === 'analytics') {
        const res = await api.get('/admin/analytics');
        if (res.success) {
          setMetrics(res.metrics);
          setRecentOrders(res.recentOrders || []);
          setTopProducts(res.topProducts || []);
        }
      } else if (activeSection === 'orders') {
        const res = await api.get(`/orders/all?status=${orderStatusFilter}`);
        if (res.success) setOrders(res.orders);
      } else if (activeSection === 'products') {
        const [pRes, cRes] = await Promise.all([api.get('/products'), api.get('/categories')]);
        if (pRes.success) setProducts(pRes.products);
        if (cRes.success) setCategories(cRes.categories);
      } else if (activeSection === 'categories') {
        const res = await api.get('/categories');
        if (res.success) setCategories(res.categories);
      } else if (activeSection === 'deals') {
        const res = await api.get('/deals/all');
        if (res.success) setDeals(res.deals);
      } else if (activeSection === 'reservations') {
        const res = await api.get('/reservations/all');
        if (res.success) setReservations(res.reservations);
      } else if (activeSection === 'customers') {
        const res = await api.get('/admin/customers');
        if (res.success) setCustomers(res.customers);
      } else if (activeSection === 'reviews') {
        const res = await api.get('/reviews/all');
        if (res.success) setReviews(res.reviews);
      } else if (activeSection === 'settings') {
        const res = await api.get('/settings');
        if (res.success) setSettingsData(res.settings);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const showTemporaryActionMsg = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3500);
  };

  // --- Handlers: Order Status Transition ---
  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      if (res.success) {
        showTemporaryActionMsg(`Order status updated to ${newStatus}`);
        loadDashboardData();
        if (orderDetailModal && orderDetailModal.id === orderId) {
          setOrderDetailModal(res.order);
        }
      }
    } catch (err) {
      alert(err.message || 'Failed to update order status');
    }
  };

  // --- Handlers: Product CRUD ---
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setPName(product.name);
      setPDesc(product.description || '');
      setPPrice(product.price);
      setPDiscount(product.discount_price || '');
      setPCatId(product.category_id);
      setPImage(product.image || '');
      setPSpicy(product.spicy_level || 0);
      setPSpecial(Boolean(product.is_special));
      setPDessert(Boolean(product.is_dessert));
      setPAvailable(Boolean(product.is_available));
    } else {
      setEditingProduct(null);
      setPName('');
      setPDesc('');
      setPPrice('');
      setPDiscount('');
      setPCatId(categories[0] ? categories[0].id : '');
      setPImage('');
      setPSpicy(0);
      setPSpecial(false);
      setPDessert(false);
      setPAvailable(true);
    }
    setProductModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: pName,
        description: pDesc,
        price: parseFloat(pPrice),
        discount_price: pDiscount ? parseFloat(pDiscount) : null,
        category_id: pCatId,
        image: pImage,
        spicy_level: parseInt(pSpicy),
        is_special: pSpecial ? 1 : 0,
        is_dessert: pDessert ? 1 : 0,
        is_available: pAvailable ? 1 : 0
      };

      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, payload);
        showTemporaryActionMsg('Product updated successfully.');
      } else {
        await api.post('/products', payload);
        showTemporaryActionMsg('New product dish created.');
      }
      setProductModalOpen(false);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/products/${id}`);
      showTemporaryActionMsg('Product removed.');
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  const handleToggleProductAvailability = async (product) => {
    try {
      await api.put(`/products/${product.id}`, { is_available: product.is_available ? 0 : 1 });
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  // --- Handlers: Deal CRUD ---
  const handleOpenDealModal = (deal = null) => {
    if (deal) {
      setEditingDeal(deal);
      setDTitle(deal.title);
      setDDesc(deal.description || '');
      setDItems(deal.items_included || '');
      setDOrigPrice(deal.original_price);
      setDDealPrice(deal.deal_price);
      setDImage(deal.image || '');
      setDBadge(deal.badge || '');
    } else {
      setEditingDeal(null);
      setDTitle('');
      setDDesc('');
      setDItems('');
      setDOrigPrice('');
      setDDealPrice('');
      setDImage('');
      setDBadge('');
    }
    setDealModalOpen(true);
  };

  const handleSaveDeal = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: dTitle,
        description: dDesc,
        items_included: dItems,
        original_price: parseFloat(dOrigPrice),
        deal_price: parseFloat(dDealPrice),
        image: dImage,
        badge: dBadge
      };

      if (editingDeal) {
        await api.put(`/deals/${editingDeal.id}`, payload);
        showTemporaryActionMsg('Deal combo updated.');
      } else {
        await api.post('/deals', payload);
        showTemporaryActionMsg('New combo deal created.');
      }
      setDealModalOpen(false);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to save deal');
    }
  };

  const handleDeleteDeal = async (id) => {
    if (!window.confirm('Delete this deal package?')) return;
    try {
      await api.delete(`/deals/${id}`);
      showTemporaryActionMsg('Deal package removed.');
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete deal');
    }
  };

  // --- Handlers: Category CRUD ---
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
    } else {
      setEditingCategory(null);
      setCatName('');
      setCatSlug('');
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/categories/${editingCategory.id}`, { name: catName, slug: catSlug });
      } else {
        await api.post('/categories', { name: catName, slug: catSlug });
      }
      setCategoryModalOpen(false);
      loadDashboardData();
      showTemporaryActionMsg('Category saved.');
    } catch (err) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      loadDashboardData();
      showTemporaryActionMsg('Category deleted.');
    } catch (err) {
      alert(err.message || 'Failed to delete category');
    }
  };

  // --- Handlers: Reservation Status ---
  const handleUpdateReservationStatus = async (id, status) => {
    try {
      await api.put(`/reservations/${id}/status`, { status });
      showTemporaryActionMsg(`Reservation marked as ${status}.`);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to update reservation');
    }
  };

  // --- Handlers: Reviews Moderation ---
  const handleToggleReviewApprove = async (id) => {
    try {
      const res = await api.put(`/reviews/${id}/approve`);
      showTemporaryActionMsg(res.message);
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to moderate review');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await api.delete(`/reviews/${id}`);
      showTemporaryActionMsg('Review removed.');
      loadDashboardData();
    } catch (err) {
      alert(err.message || 'Failed to delete review');
    }
  };

  // --- Handlers: Restaurant Settings ---
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await api.put('/settings', settingsData);
      showTemporaryActionMsg('Restaurant configurations saved successfully.');
    } catch (err) {
      alert(err.message || 'Failed to save settings');
    }
  };

  // --- Admin Login Form when not logged in as Admin ---
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setIsLoggingIn(true);
    try {
      await login(adminEmail, adminPass, true);
    } catch (err) {
      setLoginError(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <div className="w-full max-w-md rounded-3xl glass-vip border border-gold/40 p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-400 to-amber-700 p-0.5 shadow-gold-glow mx-auto mb-2">
              <div className="w-full h-full bg-dark-950 rounded-[14px] flex items-center justify-center">
                <ShieldAlert className="w-7 h-7 text-gold" />
              </div>
            </div>
            <h2 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
              Royal Admin Portal
            </h2>
            <p className="text-xs text-stone-400">
              Restricted management zone for restaurant staff and executive directors.
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Admin Email</label>
              <input
                type="email"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Secret Key / Password</label>
              <input
                type="password"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow flex items-center justify-center gap-2"
            >
              {isLoggingIn ? 'Authenticating...' : 'Enter Admin Control Center'}
            </button>

            <div className="p-3 rounded-xl bg-stone-900/80 border border-stone-800 text-[11px] text-stone-400 text-center">
              <span>Default Credentials: </span>
              <strong className="text-amber-300">admin@zayka.com</strong> / <strong className="text-amber-300">admin123</strong>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Navigation tabs list
  const navItems = [
    { id: 'analytics', label: 'Overview Analytics', icon: BarChart3 },
    { id: 'orders', label: 'Live Orders Dispatch', icon: ShoppingBag },
    { id: 'products', label: 'Dishes & Menu Catalog', icon: UtensilsCrossed },
    { id: 'categories', label: 'Food Categories', icon: Tag },
    { id: 'deals', label: 'Signature Deals', icon: Crown },
    { id: 'reservations', label: 'Table Reservations', icon: Calendar },
    { id: 'customers', label: 'VIP Customer Directory', icon: Users },
    { id: 'reviews', label: 'Reviews Moderation', icon: MessageSquare },
    { id: 'settings', label: 'Restaurant Settings', icon: Settings },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="p-5 rounded-2xl glass-vip border border-gold/30 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <ShieldAlert className="w-5 h-5 text-gold" />
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              ZAYKA Executive Command Portal
            </h1>
            <p className="text-xs text-stone-400">
              Logged in as <strong className="text-amber-300">{user.name}</strong> ({user.email})
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadDashboardData}
            className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 hover:border-gold/40 text-stone-300 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Sync Data</span>
          </button>
          <button
            onClick={() => setActivePage('home')}
            className="px-3.5 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-300 text-xs font-semibold hover:text-white"
          >
            Exit to Client Site
          </button>
        </div>
      </div>

      {actionMsg && (
        <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-600 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Navigation Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-2 border ${
                isActive
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 border-gold shadow-gold-glow'
                  : 'glass-card text-stone-300 border-stone-800 hover:border-gold/30 hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 1. SECTION: OVERVIEW ANALYTICS */}
      {/* ======================================================== */}
      {activeSection === 'analytics' && metrics && (
        <div className="space-y-8">
          {/* KPI Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl glass-card border border-gold/15 space-y-2">
              <span className="text-[11px] text-stone-400 block font-medium">Total Orders Placed</span>
              <p className="font-serif text-3xl font-bold text-stone-100">{metrics.totalOrders}</p>
              <p className="text-[10px] text-amber-400">Lifetime volume</p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-gold/15 space-y-2">
              <span className="text-[11px] text-stone-400 block font-medium">Total Revenue Collected</span>
              <p className="font-serif text-3xl font-bold text-amber-400">
                Rs. {metrics.totalRevenue.toLocaleString()}
              </p>
              <p className="text-[10px] text-emerald-400">Delivered & active orders</p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-gold/15 space-y-2">
              <span className="text-[11px] text-stone-400 block font-medium">Active Kitchen Orders</span>
              <p className="font-serif text-3xl font-bold text-yellow-300">{metrics.pendingOrders}</p>
              <p className="text-[10px] text-yellow-400">Pending & Cooking</p>
            </div>

            <div className="p-5 rounded-2xl glass-card border border-gold/15 space-y-2">
              <span className="text-[11px] text-stone-400 block font-medium">Table Reservations</span>
              <p className="font-serif text-3xl font-bold text-stone-100">{metrics.totalReservations}</p>
              <p className="text-[10px] text-amber-300">{metrics.pendingReservations} Pending Approval</p>
            </div>
          </div>

          {/* Quick Tables: Recent Orders & Top Dishes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Orders */}
            <div className="p-6 rounded-2xl glass-card border border-stone-800 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-base font-bold text-stone-100 gold-gradient-text">
                  Recent Incoming Orders
                </h3>
                <button
                  onClick={() => setActiveSection('orders')}
                  className="text-xs text-amber-400 hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              <div className="space-y-2.5">
                {recentOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-mono font-bold text-amber-400">{ord.order_number}</span>
                      <p className="text-stone-300 text-[11px] mt-0.5">{ord.customer_name} • {ord.order_type}</p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-stone-100 block">Rs. {ord.total_amount.toLocaleString()}</span>
                      <span className="text-[10px] uppercase font-semibold text-yellow-400">
                        {ord.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Selling Products */}
            <div className="p-6 rounded-2xl glass-card border border-stone-800 space-y-4">
              <h3 className="font-serif text-base font-bold text-stone-100 gold-gradient-text">
                Top Selling Delicacies
              </h3>

              <div className="space-y-2.5">
                {topProducts.map((p, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="font-bold text-stone-200">{p.product_name}</span>
                      <p className="text-[11px] text-stone-400">{p.total_sold} portions served</p>
                    </div>
                    <span className="font-serif font-bold text-amber-400">
                      Rs. {p.total_sales.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 2. SECTION: LIVE ORDERS DISPATCH */}
      {/* ======================================================== */}
      {activeSection === 'orders' && (
        <div className="space-y-6">
          {/* Status filter bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl glass-card border border-stone-800">
            <div className="flex flex-wrap gap-2">
              {['all', 'pending', 'confirmed', 'preparing', 'ready', 'out_for_delivery', 'delivered', 'cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setOrderStatusFilter(st)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all ${
                    orderStatusFilter === st
                      ? 'bg-amber-500 text-dark-950 font-black'
                      : 'bg-stone-900 text-stone-400 hover:text-stone-200 border border-stone-800'
                  }`}
                >
                  {st.replace(/_/g, ' ')}
                </button>
              ))}
            </div>

            <div className="text-xs text-stone-400">
              Showing <strong>{orders.length}</strong> orders
            </div>
          </div>

          {/* Orders Table */}
          <div className="rounded-2xl glass-card border border-stone-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 border-b border-stone-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="p-4">Order #</th>
                  <th className="p-4">Patron Info</th>
                  <th className="p-4">Service & Address</th>
                  <th className="p-4">Items</th>
                  <th className="p-4">Total</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800/80">
                {orders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-stone-900/40 transition-colors">
                    <td className="p-4 font-mono font-bold text-amber-400">
                      {ord.order_number}
                      <span className="block text-[10px] font-sans text-stone-500 font-normal">
                        {new Date(ord.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    <td className="p-4">
                      <p className="font-bold text-stone-100">{ord.customer_name}</p>
                      <p className="text-[11px] text-stone-400">{ord.customer_phone}</p>
                    </td>

                    <td className="p-4 max-w-xs">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-800 text-amber-300 mr-1.5">
                        {ord.order_type}
                      </span>
                      <span className="text-[11px] text-stone-300 line-clamp-1">{ord.address}</span>
                    </td>

                    <td className="p-4">
                      <span className="text-stone-300">
                        {ord.items ? ord.items.reduce((s, it) => s + it.quantity, 0) : 0} items
                      </span>
                    </td>

                    <td className="p-4 font-serif font-bold text-stone-100">
                      Rs. {ord.total_amount.toLocaleString()}
                    </td>

                    <td className="p-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase border ${
                          ord.status === 'delivered'
                            ? 'bg-emerald-950/80 text-emerald-400 border-emerald-700/60'
                            : ord.status === 'cancelled'
                            ? 'bg-red-950/80 text-red-400 border-red-700/60'
                            : 'bg-amber-950/80 text-yellow-300 border-amber-600/60'
                        }`}
                      >
                        {ord.status.replace(/_/g, ' ')}
                      </span>
                    </td>

                    <td className="p-4 text-right space-x-1 whitespace-nowrap">
                      {/* Step Actions */}
                      {ord.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'confirmed')}
                          className="px-2.5 py-1 rounded-lg bg-blue-900/60 hover:bg-blue-800 text-blue-200 text-[11px] font-semibold border border-blue-700"
                        >
                          Confirm
                        </button>
                      )}

                      {ord.status === 'confirmed' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'preparing')}
                          className="px-2.5 py-1 rounded-lg bg-amber-900/60 hover:bg-amber-800 text-yellow-200 text-[11px] font-semibold border border-amber-700"
                        >
                          Cook in Kitchen
                        </button>
                      )}

                      {ord.status === 'preparing' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'out_for_delivery')}
                          className="px-2.5 py-1 rounded-lg bg-purple-900/60 hover:bg-purple-800 text-purple-200 text-[11px] font-semibold border border-purple-700"
                        >
                          Dispatch Rider
                        </button>
                      )}

                      {ord.status === 'out_for_delivery' && (
                        <button
                          onClick={() => handleUpdateOrderStatus(ord.id, 'delivered')}
                          className="px-2.5 py-1 rounded-lg bg-emerald-900/60 hover:bg-emerald-800 text-emerald-200 text-[11px] font-semibold border border-emerald-700"
                        >
                          Mark Delivered
                        </button>
                      )}

                      <button
                        onClick={() => setOrderDetailModal(ord)}
                        className="px-2.5 py-1 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-[11px] font-semibold"
                      >
                        Invoice / Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. SECTION: PRODUCTS CATALOG */}
      {/* ======================================================== */}
      {activeSection === 'products' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              Royal Catalog ({products.length} Dishes)
            </h2>
            <button
              onClick={() => handleOpenProductModal(null)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs flex items-center gap-1.5 shadow-gold-glow"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Dish</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {products.map((p) => (
              <div
                key={p.id}
                className="rounded-2xl glass-card border border-stone-800 overflow-hidden flex flex-col justify-between hover:border-gold/30 transition-all"
              >
                <div className="relative h-44">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-2 left-2 flex gap-1">
                    <button
                      onClick={() => handleToggleProductAvailability(p)}
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase border ${
                        p.is_available
                          ? 'bg-emerald-950/80 text-emerald-400 border-emerald-600'
                          : 'bg-red-950/80 text-red-400 border-red-600'
                      }`}
                    >
                      {p.is_available ? 'Available' : 'Sold Out'}
                    </button>
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <span className="text-[10px] text-amber-400 uppercase font-semibold">
                    {p.category_name || 'Chef Specialty'}
                  </span>
                  <h4 className="font-serif text-sm font-bold text-stone-100">{p.name}</h4>
                  <p className="text-xs text-stone-400 line-clamp-2">{p.description}</p>
                  <p className="font-serif font-bold text-amber-400 text-sm">
                    Rs. {(p.discount_price || p.price).toLocaleString()}
                  </p>
                </div>

                <div className="p-3 border-t border-stone-800 flex justify-end gap-2 bg-stone-900/60">
                  <button
                    onClick={() => handleOpenProductModal(p)}
                    className="p-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200"
                    title="Edit Dish"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteProduct(p.id)}
                    className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/80 text-red-300"
                    title="Delete Dish"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. SECTION: CATEGORIES */}
      {/* ======================================================== */}
      {activeSection === 'categories' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              Food Categories
            </h2>
            <button
              onClick={() => handleOpenCategoryModal(null)}
              className="px-4 py-2 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add Category</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <div
                key={c.id}
                className="p-4 rounded-xl glass-card border border-stone-800 flex items-center justify-between"
              >
                <div>
                  <h4 className="font-bold text-stone-100 text-xs sm:text-sm">{c.name}</h4>
                  <p className="text-[11px] text-stone-400">Slug: {c.slug}</p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => handleOpenCategoryModal(c)}
                    className="p-1.5 rounded bg-stone-800 text-stone-300 hover:text-white"
                  >
                    <Edit className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteCategory(c.id)}
                    className="p-1.5 rounded bg-red-950/60 text-red-300 hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. SECTION: SIGNATURE DEALS */}
      {/* ======================================================== */}
      {activeSection === 'deals' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
              Signature Deals & Combos
            </h2>
            <button
              onClick={() => handleOpenDealModal(null)}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Deal</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {deals.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl glass-card border border-stone-800 space-y-4">
                <div className="flex gap-4">
                  <img src={d.image} alt={d.title} className="w-24 h-24 rounded-xl object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] uppercase font-bold text-amber-400">{d.badge}</span>
                    <h3 className="font-serif text-base font-bold text-stone-100 truncate">{d.title}</h3>
                    <p className="text-xs text-stone-400 line-clamp-2 mt-1">{d.description}</p>
                    <p className="font-serif font-bold text-amber-400 mt-2">
                      Rs. {d.deal_price.toLocaleString()}{' '}
                      <span className="line-through text-stone-500 text-xs font-normal">
                        Rs. {d.original_price.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-stone-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleOpenDealModal(d)}
                    className="p-1.5 rounded-lg bg-stone-800 text-stone-200"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteDeal(d.id)}
                    className="p-1.5 rounded-lg bg-red-950/60 text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. SECTION: TABLE RESERVATIONS */}
      {/* ======================================================== */}
      {activeSection === 'reservations' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
            Table Reservations Management
          </h2>

          <div className="rounded-2xl glass-card border border-stone-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 border-b border-stone-800 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Code</th>
                  <th className="p-4">Guest Info</th>
                  <th className="p-4">Date & Time</th>
                  <th className="p-4">Guests</th>
                  <th className="p-4">Seating Zone</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td className="p-4 font-mono font-bold text-amber-400">{r.reservation_code}</td>
                    <td className="p-4">
                      <p className="font-bold text-stone-100">{r.customer_name}</p>
                      <p className="text-[11px] text-stone-400">{r.customer_phone}</p>
                    </td>
                    <td className="p-4">{r.reservation_date} at {r.reservation_time}</td>
                    <td className="p-4 font-bold">{r.guests_count} Guests</td>
                    <td className="p-4 text-amber-300">{r.seating_area}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-stone-800 text-yellow-300 border border-stone-700">
                        {r.status}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      {r.status === 'pending' && (
                        <button
                          onClick={() => handleUpdateReservationStatus(r.id, 'confirmed')}
                          className="px-2.5 py-1 rounded bg-emerald-900/80 text-emerald-200 text-[11px] font-semibold"
                        >
                          Approve
                        </button>
                      )}
                      {r.status !== 'cancelled' && (
                        <button
                          onClick={() => handleUpdateReservationStatus(r.id, 'cancelled')}
                          className="px-2.5 py-1 rounded bg-red-950 text-red-300 text-[11px]"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 7. SECTION: CUSTOMER DIRECTORY */}
      {/* ======================================================== */}
      {activeSection === 'customers' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
            Registered VIP Customer Accounts ({customers.length})
          </h2>

          <div className="rounded-2xl glass-card border border-stone-800 overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-300">
              <thead className="bg-stone-900/90 text-stone-400 border-b border-stone-800 uppercase text-[10px]">
                <tr>
                  <th className="p-4">Customer Name</th>
                  <th className="p-4">Contact (Email/Phone)</th>
                  <th className="p-4">Auth Provider</th>
                  <th className="p-4">Total Orders</th>
                  <th className="p-4">Lifetime Spend</th>
                  <th className="p-4">Member Since</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800">
                {customers.map((c) => (
                  <tr key={c.id}>
                    <td className="p-4 font-bold text-stone-100">{c.name}</td>
                    <td className="p-4 text-stone-400">
                      <p>{c.email || '—'}</p>
                      <p>{c.phone || '—'}</p>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-stone-800 text-stone-300">
                        {c.provider}
                      </span>
                    </td>
                    <td className="p-4 font-bold">{c.total_orders || 0} Orders</td>
                    <td className="p-4 font-serif font-bold text-amber-400">
                      Rs. {(c.total_spent || 0).toLocaleString()}
                    </td>
                    <td className="p-4 text-stone-500">
                      {new Date(c.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 8. SECTION: REVIEWS MODERATION */}
      {/* ======================================================== */}
      {activeSection === 'reviews' && (
        <div className="space-y-6">
          <h2 className="font-serif text-xl font-bold text-stone-100 gold-gradient-text">
            Customer Reviews Moderation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div key={rev.id} className="p-5 rounded-2xl glass-card border border-stone-800 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-stone-100 text-xs sm:text-sm">{rev.customer_name}</h4>
                    <span className="text-[11px] text-amber-400">{'★'.repeat(rev.rating)}</span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      rev.is_approved ? 'bg-emerald-950 text-emerald-400' : 'bg-stone-800 text-stone-500'
                    }`}
                  >
                    {rev.is_approved ? 'Approved' : 'Hidden'}
                  </span>
                </div>

                <p className="text-xs text-stone-300 italic">"{rev.comment}"</p>

                <div className="pt-2 border-t border-stone-800 flex justify-end gap-2">
                  <button
                    onClick={() => handleToggleReviewApprove(rev.id)}
                    className="px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs"
                  >
                    {rev.is_approved ? 'Hide Review' : 'Approve Review'}
                  </button>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1 rounded bg-red-950/60 text-red-300 hover:bg-red-900"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 9. SECTION: SETTINGS */}
      {/* ======================================================== */}
      {activeSection === 'settings' && (
        <form onSubmit={handleSaveSettings} className="max-w-2xl p-6 sm:p-8 rounded-3xl glass-vip border border-gold/30 space-y-4">
          <h2 className="font-serif text-2xl font-bold text-stone-100 gold-gradient-text">
            Restaurant Configuration & Brand Details
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Restaurant Name</label>
              <input
                type="text"
                value={settingsData.restaurant_name || ''}
                onChange={(e) => setSettingsData({ ...settingsData, restaurant_name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Currency Symbol</label>
              <input
                type="text"
                value={settingsData.currency || 'Rs.'}
                onChange={(e) => setSettingsData({ ...settingsData, currency: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">Luxury Tagline</label>
              <input
                type="text"
                value={settingsData.tagline || ''}
                onChange={(e) => setSettingsData({ ...settingsData, tagline: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Contact Phone</label>
              <input
                type="text"
                value={settingsData.phone || ''}
                onChange={(e) => setSettingsData({ ...settingsData, phone: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">WhatsApp Fast Ordering</label>
              <input
                type="text"
                value={settingsData.whatsapp || ''}
                onChange={(e) => setSettingsData({ ...settingsData, whatsapp: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Standard Delivery Fee (Rs.)</label>
              <input
                type="number"
                value={settingsData.delivery_fee || '150'}
                onChange={(e) => setSettingsData({ ...settingsData, delivery_fee: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">Free Delivery Min Order (Rs.)</label>
              <input
                type="number"
                value={settingsData.free_delivery_min || '2000'}
                onChange={(e) => setSettingsData({ ...settingsData, free_delivery_min: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-stone-300 mb-1">Address</label>
              <input
                type="text"
                value={settingsData.address || ''}
                onChange={(e) => setSettingsData({ ...settingsData, address: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs outline-none focus:border-gold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow mt-4"
          >
            Save Restaurant Configuration
          </button>
        </form>
      )}

      {/* PRODUCT CREATION/EDIT MODAL */}
      {productModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveProduct}
            className="relative w-full max-w-lg rounded-2xl glass-vip border border-gold/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setProductModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text">
              {editingProduct ? 'Edit Dish Catalog' : 'Add New Gourmet Dish'}
            </h3>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Dish Name *</label>
              <input
                type="text"
                value={pName}
                onChange={(e) => setPName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Description</label>
              <textarea
                rows="2"
                value={pDesc}
                onChange={(e) => setPDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Price (Rs.) *</label>
                <input
                  type="number"
                  value={pPrice}
                  onChange={(e) => setPPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Discount Price (Rs.)</label>
                <input
                  type="number"
                  value={pDiscount}
                  onChange={(e) => setPDiscount(e.target.value)}
                  placeholder="Optional"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Category *</label>
                <select
                  value={pCatId}
                  onChange={(e) => setPCatId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Spicy Level (0-3)</label>
                <select
                  value={pSpicy}
                  onChange={(e) => setPSpicy(parseInt(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold"
                >
                  <option value={0}>0 - Mild / No Spice</option>
                  <option value={1}>1 - Gentle Warmth</option>
                  <option value={2}>2 - Medium Spicy</option>
                  <option value={3}>3 - Extra Royal Hot</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Dish Image URL</label>
              <input
                type="url"
                value={pImage}
                onChange={(e) => setPImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs focus:border-gold"
              />
            </div>

            <div className="flex flex-wrap gap-4 pt-2 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pSpecial}
                  onChange={(e) => setPSpecial(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-900 text-amber-500"
                />
                <span>Chef's Special Feature</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pDessert}
                  onChange={(e) => setPDessert(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-900 text-amber-500"
                />
                <span>Is Dessert / Ice Cream</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={pAvailable}
                  onChange={(e) => setPAvailable(e.target.checked)}
                  className="rounded border-stone-700 bg-stone-900 text-amber-500"
                />
                <span>In Stock & Available</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow"
            >
              Save Gourmet Dish
            </button>
          </form>
        </div>
      )}

      {/* DEAL CREATION/EDIT MODAL */}
      {dealModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveDeal}
            className="relative w-full max-w-lg rounded-2xl glass-vip border border-gold/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto"
          >
            <button
              type="button"
              onClick={() => setDealModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text">
              {editingDeal ? 'Edit Deal Combo' : 'Create New Royal Combo Deal'}
            </h3>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Deal Title *</label>
              <input
                type="text"
                value={dTitle}
                onChange={(e) => setDTitle(e.target.value)}
                placeholder="e.g. Grand Royal Family Banquet"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Description</label>
              <textarea
                rows="2"
                value={dDesc}
                onChange={(e) => setDDesc(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs resize-none"
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Items Included (Comma separated)</label>
              <input
                type="text"
                value={dItems}
                onChange={(e) => setDItems(e.target.value)}
                placeholder="e.g. 1 Wagyu Burger, 1 Truffle Fries, 1 Mojito"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Original Price (Rs.)</label>
                <input
                  type="number"
                  value={dOrigPrice}
                  onChange={(e) => setDOrigPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                  required
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Deal Price (Rs.)</label>
                <input
                  type="number"
                  value={dDealPrice}
                  onChange={(e) => setDDealPrice(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-stone-300 mb-1">Deal Badge</label>
                <input
                  type="text"
                  value={dBadge}
                  onChange={(e) => setDBadge(e.target.value)}
                  placeholder="e.g. Save 25%, Bestseller"
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                />
              </div>

              <div>
                <label className="block text-xs text-stone-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={dImage}
                  onChange={(e) => setDImage(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-dark-950 font-bold text-xs sm:text-sm hover:brightness-110 shadow-gold-glow"
            >
              Save Deal Combo
            </button>
          </form>
        </div>
      )}

      {/* CATEGORY MODAL */}
      {categoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <form
            onSubmit={handleSaveCategory}
            className="relative w-full max-w-sm rounded-2xl glass-vip border border-gold/30 p-6 space-y-4"
          >
            <button
              type="button"
              onClick={() => setCategoryModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-serif text-lg font-bold text-stone-100 gold-gradient-text">
              {editingCategory ? 'Edit Category' : 'Add Category'}
            </h3>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Category Name</label>
              <input
                type="text"
                value={catName}
                onChange={(e) => setCatName(e.target.value)}
                placeholder="e.g. Gourmet Burgers"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs text-stone-300 mb-1">Slug (URL friendly)</label>
              <input
                type="text"
                value={catSlug}
                onChange={(e) => setCatSlug(e.target.value)}
                placeholder="e.g. burgers"
                className="w-full px-3 py-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs sm:text-sm"
            >
              Save Category
            </button>
          </form>
        </div>
      )}

      {/* ORDER INVOICE MODAL */}
      {orderDetailModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-2xl glass-vip border border-gold/30 p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setOrderDetailModal(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-stone-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-[10px] text-stone-400 block uppercase">Royal Invoice</span>
                <span className="font-mono text-lg font-bold text-amber-400">{orderDetailModal.order_number}</span>
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-amber-500/20 text-yellow-300 border border-amber-500/30">
                {orderDetailModal.status}
              </span>
            </div>

            <div className="text-xs space-y-1 text-stone-300">
              <p><strong>Customer:</strong> {orderDetailModal.customer_name}</p>
              <p><strong>Phone:</strong> {orderDetailModal.customer_phone}</p>
              <p><strong>Email:</strong> {orderDetailModal.customer_email || '—'}</p>
              <p><strong>Address:</strong> {orderDetailModal.address}</p>
              {orderDetailModal.notes && (
                <p className="p-2 bg-stone-900 rounded border border-stone-800 text-[11px] italic">
                  Note: {orderDetailModal.notes}
                </p>
              )}
            </div>

            {/* Items */}
            <div className="pt-2 border-t border-stone-800 space-y-2">
              <p className="text-xs font-bold text-stone-200">Dishes Ordered:</p>
              {orderDetailModal.items && orderDetailModal.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs py-1 border-b border-stone-900">
                  <span>{it.quantity} × {it.product_name}</span>
                  <span className="font-semibold text-amber-400">Rs. {(it.price * it.quantity).toLocaleString()}</span>
                </div>
              ))}
            </div>

            <div className="pt-2 border-t border-stone-800 space-y-1 text-xs">
              <div className="flex justify-between text-stone-400">
                <span>Subtotal:</span>
                <span>Rs. {orderDetailModal.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-stone-400">
                <span>Delivery:</span>
                <span>Rs. {orderDetailModal.delivery_fee.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-sm text-stone-100 pt-1 border-t border-stone-800">
                <span>Grand Total:</span>
                <span className="text-amber-400">Rs. {orderDetailModal.total_amount.toLocaleString()}</span>
              </div>
            </div>

            <div className="pt-3 border-t border-stone-800 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-xl bg-stone-800 text-stone-200 text-xs font-semibold hover:bg-stone-700"
              >
                Print Receipt
              </button>
              <button
                onClick={() => setOrderDetailModal(null)}
                className="px-4 py-2.5 rounded-xl bg-amber-500 text-dark-950 font-bold text-xs"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
