// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const STORAGE_KEY = 'cart_items';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  // Adds a product to the cart. If the same product + size already
  // exists, it increases the quantity instead of creating a duplicate row.
  const addToCart = (product, { size = null, quantity = 1 } = {}) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item._id === product._id && item.size === size
      );

      if (existingIndex !== -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.heroImage || product.image,
          size,
          quantity,
        },
      ];
    });
  };

  const removeFromCart = (productId, size = null) => {
    setItems((prev) =>
      prev.filter((item) => !(item._id === productId && item.size === size))
    );
  };

  const updateQuantity = (productId, size, quantity) => {
    setItems((prev) =>
      prev.map((item) =>
        item._id === productId && item.size === size
          ? { ...item, quantity: Math.max(1, quantity) }
          : item
      )
    );
  };

  const clearCart = () => setItems([]);

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = items.reduce(
    (sum, item) => sum + (item.price || 0) * item.quantity,
    0
  );

  const isInCart = (productId, size = null) =>
    items.some((item) => item._id === productId && item.size === size);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
};