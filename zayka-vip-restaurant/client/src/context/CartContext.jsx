import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('zayka_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);
  const [orderType, setOrderType] = useState('delivery'); // 'delivery' | 'pickup'

  useEffect(() => {
    try {
      localStorage.setItem('zayka_cart', JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items]);

  const addToCart = (product, quantity = 1, instructions = '') => {
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.id === product.id);
      const price = product.discount_price || product.deal_price || product.price;

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        if (instructions) {
          updated[existingIndex].instructions = instructions;
        }
        return updated;
      }

      return [
        ...prev,
        {
          id: product.id,
          name: product.name || product.title,
          price: price,
          originalPrice: product.original_price || product.price,
          image: product.image,
          quantity: quantity,
          instructions: instructions || ''
        }
      ];
    });

    setIsOpen(true);
  };

  const removeFromCart = (productId) => {
    setItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen(prev => !prev);

  // Calculations
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  // Free delivery threshold Rs. 2000
  const deliveryFee = orderType === 'pickup' ? 0 : (subtotal >= 2000 || subtotal === 0 ? 0 : 150);
  const total = subtotal + deliveryFee;

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        orderType,
        setOrderType,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        totalItems,
        subtotal,
        deliveryFee,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
