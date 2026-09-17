import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

function productIdOf(item) {
  return Number(item.product_id || item.id);
}

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refreshWishlist = async () => {
    if (!user?.id || user.role !== 'CUSTOMER') {
      setItems([]);
      return;
    }

    setLoading(true);
    try {
      const response = await api.get('/api/wishlist');
      setItems(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('Failed to load wishlist:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshWishlist();
  }, [user?.id, user?.role]);

  const wishlistProductIds = items.map(productIdOf);

  const toggleWishlist = async (productId) => {
    const normalizedId = Number(productId);
    const saved = wishlistProductIds.includes(normalizedId);

    if (saved) {
      await api.delete(`/api/wishlist/${normalizedId}`);
      setItems((current) => current.filter((item) => productIdOf(item) !== normalizedId));
      return false;
    }

    const response = await api.post('/api/wishlist', {
      product_id: normalizedId,
      productId: normalizedId,
    });
    const item = response.data?.wishlist || { product_id: normalizedId, id: normalizedId };
    setItems((current) => [...current.filter((entry) => productIdOf(entry) !== normalizedId), item]);
    return true;
  };

  const removeWishlistItem = async (productId) => {
    const normalizedId = Number(productId);
    await api.delete(`/api/wishlist/${normalizedId}`);
    setItems((current) => current.filter((item) => productIdOf(item) !== normalizedId));
  };

  return (
    <WishlistContext.Provider value={{
      items,
      wishlistProductIds,
      loading,
      refreshWishlist,
      toggleWishlist,
      removeWishlistItem,
    }}>
      {children}
    </WishlistContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWishlist() {
  return useContext(WishlistContext);
}
