// src/context/WishlistContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const WishlistContext = createContext(null);

const STORAGE_KEY = 'wishlist_items';

export const WishlistProvider = ({ children }) => {
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

  const isLiked = (productId) =>
    items.some((item) => item._id === productId);

  const toggleLike = (product) => {
    setItems((prev) => {
      const alreadyLiked = prev.some((item) => item._id === product._id);
      if (alreadyLiked) {
        return prev.filter((item) => item._id !== product._id);
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.heroImage || product.image,
        },
      ];
    });
  };

  const removeFromWishlist = (productId) => {
    setItems((prev) => prev.filter((item) => item._id !== productId));
  };

  const clearWishlist = () => setItems([]);

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLiked,
        toggleLike,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within a WishlistProvider');
  return ctx;
};