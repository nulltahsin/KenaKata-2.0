import { createContext, useContext, useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

const getCartStorageKey = (user) => (user?.id ? `kenakata_cart_${user.id}` : 'kenakata_cart_guest');

const readCartFromStorage = (user) => {
  try {
    const key = getCartStorageKey(user);
    const raw = localStorage.getItem(key);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to read cart from storage', error);
    return [];
  }
};

export function CartProvider({ children }) {
  const { user } = useAuth();
  const [items, setItems] = useState(() => readCartFromStorage(user));

  const syncCart = async () => {
    if (!user?.id) {
      setItems(readCartFromStorage(user));
      return;
    }

    try {
      const response = await api.get('/api/cart');
      const mapped = response.data.map((item) => ({
        id: item.product_id,
        product_id: item.product_id,
        hold_id: item.hold_id,
        name: item.name,
        store: item.store,
        price: Number(item.price),
        image: item.image,
        quantity: Number(item.quantity),
        expires_at: item.expires_at,
      }));

      setItems(mapped);
      localStorage.setItem(getCartStorageKey(user), JSON.stringify(mapped));
    } catch (error) {
      console.error('Failed to load cart from backend', error);
      setItems(readCartFromStorage(user));
    }
  };

  useEffect(() => {
    syncCart();
  }, [user?.id]);

  const addToCart = async (product, quantity = 1) => {
    const productStock = Number(product.stock ?? product.stock_qty ?? 0);
    const currentQty = items.find((item) => item.id === product.id)?.quantity || 0;

    if (productStock <= 0 || currentQty + quantity > productStock) {
      throw new Error('Not enough stock available');
    }

    if (!user?.id) {
      const next = [...readCartFromStorage(user)];
      const found = next.find((item) => item.id === product.id);
      if (found) {
        found.quantity = Math.min(productStock, found.quantity + quantity);
      } else {
        next.push({ id: product.id, name: product.name, store: product.store, price: product.price, image: product.image, quantity: Math.min(quantity, productStock) });
      }
      localStorage.setItem(getCartStorageKey(user), JSON.stringify(next));
      setItems(next);
      return next;
    }

    try {
      const response = await api.post('/api/cart/add', {
        product_id: product.id,
        quantity,
      });
      await syncCart();
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const removeFromCart = async (id) => {
    if (!user?.id) {
      const next = items.filter((item) => item.id !== id);
      setItems(next);
      localStorage.setItem(getCartStorageKey(user), JSON.stringify(next));
      return;
    }

    try {
      await api.delete(`/api/cart/remove/${id}`);
      await syncCart();
    } catch (error) {
      console.error('Failed to remove cart item', error);
      throw error;
    }
  };

  const updateQuantity = async (id, delta) => {
    if (!user?.id) {
      const next = items.map((item) => item.id === id ? { ...item, quantity: Math.max(1, item.quantity + delta) } : item);
      setItems(next);
      localStorage.setItem(getCartStorageKey(user), JSON.stringify(next));
      return;
    }

    const currentItem = items.find((item) => item.id === id);
    if (!currentItem) return;

    const newQty = Math.max(1, currentItem.quantity + delta);
    if (newQty === currentItem.quantity) return;

    try {
      await api.post('/api/cart/add', { product_id: id, quantity: newQty - currentItem.quantity });
      await syncCart();
    } catch (error) {
      console.error('Failed to update cart quantity', error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!user?.id) {
      setItems([]);
      localStorage.removeItem(getCartStorageKey(user));
      return;
    }

    try {
      await api.delete('/api/cart/clear');
      setItems([]);
      localStorage.removeItem(getCartStorageKey(user));
    } catch (error) {
      console.error('Failed to clear cart', error);
      throw error;
    }
  };

  const cartCount = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const cartTotal = items.reduce((sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal }}>
      {children}
    </CartContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  return useContext(CartContext);
}