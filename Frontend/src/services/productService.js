// export const products = [
//   {
//     id: 1,
//     name: 'Premium Oversized Tee',
//     category: 'Fashion',
//     store: 'Urban Thread',
//     price: 1290,
//     stock: 24,
//     image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
//     tag: 'TRENDING',
//     description: 'Soft heavyweight cotton tee with a relaxed oversized fit. Pre-shrunk, breathable and made for everyday comfort.'
//   },
//   {
//     id: 2,
//     name: 'Wireless Headphones',
//     category: 'Electronics',
//     store: 'Tech Haven',
//     price: 3490,
//     stock: 15,
//     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
//     tag: 'POPULAR',
//     description: 'Noise-isolating wireless headphones with 30-hour battery life, deep bass and crystal-clear calls.'
//   },
//   {
//     id: 3,
//     name: 'Organic Green Basket',
//     category: 'Grocery',
//     store: 'Fresh Corner',
//     price: 890,
//     stock: 40,
//     image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
//     tag: 'FRESH',
//     description: 'A fresh basket of seasonal organic greens, harvested daily from local farmers.'
//   },
//   {
//     id: 4,
//     name: 'Classic Leather Wallet',
//     category: 'Fashion',
//     store: 'The Leather Co.',
//     price: 1850,
//     stock: 18,
//     image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
//     tag: 'NEW',
//     description: 'Handcrafted genuine leather wallet with six card slots and a coin pocket.'
//   },
//   {
//     id: 5,
//     name: 'Ceramic Plant Pot',
//     category: 'Home & Living',
//     store: 'Green Space',
//     price: 650,
//     stock: 30,
//     image: 'https://images.unsplash.com/photo-1485955900659-3561bde0c203?w=800',
//     tag: null,
//     description: 'Minimal matte ceramic pot, perfect for indoor plants and desk styling.'
//   },
//   {
//     id: 6,
//     name: 'Smart Watch Pro',
//     category: 'Electronics',
//     store: 'Tech Haven',
//     price: 4990,
//     stock: 12,
//     image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
//     tag: 'SALE',
//     description: 'Fitness tracking, heart-rate monitor and smart notifications in a sleek aluminium body.'
//   },
//   {
//     id: 7,
//     name: 'Cotton Bedsheet Set',
//     category: 'Home & Living',
//     store: 'Home Essentials',
//     price: 2290,
//     stock: 20,
//     image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
//     tag: null,
//     description: 'Breathable 300-thread-count cotton bedsheet set with two pillow covers.'
//   },
//   {
//     id: 8,
//     name: 'Fresh Fruit Box',
//     category: 'Grocery',
//     store: 'Fresh Corner',
//     price: 590,
//     stock: 35,
//     image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
//     tag: 'FRESH',
//     description: 'A handpicked box of seasonal fruits, washed and packed for same-day delivery.'
//   }
// ];

// export function getProductById(id) {
//   return products.find(p => p.id === Number(id));
// }

// export function getRelatedProducts(product, limit = 4) {
//   const same = products.filter(p => p.category === product.category && p.id !== product.id);
//   const others = products.filter(p => p.category !== product.category);
//   return [...same, ...others].slice(0, limit);
// }

// export const products = [
//   {
//     id: 1,
//     name: 'Premium Oversized Tee',
//     category: 'Fashion',
//     store: 'Urban Thread',
//     price: 1290,
//     stock: 24,
//     image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
//     tag: 'TRENDING',
//     description: 'Soft heavyweight cotton tee with a relaxed oversized fit. Pre-shrunk, breathable and made for everyday comfort.'
//   },
//   {
//     id: 2,
//     name: 'Wireless Headphones',
//     category: 'Electronics',
//     store: 'Tech Haven',
//     price: 3490,
//     stock: 15,
//     image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
//     tag: 'POPULAR',
//     description: 'Noise-isolating wireless headphones with 30-hour battery life, deep bass and crystal-clear calls.'
//   },
//   {
//     id: 3,
//     name: 'Organic Green Basket',
//     category: 'Grocery',
//     store: 'Fresh Corner',
//     price: 890,
//     stock: 40,
//     image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800',
//     tag: 'FRESH',
//     description: 'A fresh basket of seasonal organic greens, harvested daily from local farmers.'
//   },
//   {
//     id: 4,
//     name: 'Classic Leather Wallet',
//     category: 'Fashion',
//     store: 'The Leather Co.',
//     price: 1850,
//     stock: 18,
//     image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800',
//     tag: 'NEW',
//     description: 'Handcrafted genuine leather wallet with six card slots and a coin pocket.'
//   },
//   {
//     id: 5,
//     name: 'Ceramic Plant Pot',
//     category: 'Home & Living',
//     store: 'Green Space',
//     price: 650,
//     stock: 30,
//     image: 'https://images.unsplash.com/photo-1485955900659-3561bde0c203?w=800',
//     tag: null,
//     description: 'Minimal matte ceramic pot, perfect for indoor plants and desk styling.'
//   },
//   {
//     id: 6,
//     name: 'Smart Watch Pro',
//     category: 'Electronics',
//     store: 'Tech Haven',
//     price: 5490,
//     stock: 12,
//     image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800',
//     tag: 'SALE',
//     description: 'Fitness tracking, heart-rate monitor and smart notifications in a sleek aluminium body.'
//   },
//   {
//     id: 7,
//     name: 'Cotton Bedsheet Set',
//     category: 'Home & Living',
//     store: 'Home Essentials',
//     price: 2290,
//     stock: 20,
//     image: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800',
//     tag: null,
//     description: 'Breathable 300-thread-count cotton bedsheet set with two pillow covers.'
//   },
//   {
//     id: 8,
//     name: 'Fresh Fruit Box',
//     category: 'Grocery',
//     store: 'Fresh Corner',
//     price: 590,
//     stock: 35,
//     image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800',
//     tag: 'FRESH',
//     description: 'A handpicked box of seasonal fruits, washed and packed for same-day delivery.'
//   },
//   {
//     id: 9,
//     name: '4K Action Camera',
//     category: 'Electronics',
//     store: 'Tech Haven',
//     price: 6990,
//     stock: 8,
//     image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99b?w=800',
//     tag: 'NEW',
//     description: 'Waterproof 4K action camera with image stabilization and dual touch screens.'
//   },
//   {
//     id: 10,
//     name: 'Gaming Console X',
//     category: 'Electronics',
//     store: 'Tech Haven',
//     price: 8990,
//     stock: 5,
//     image: 'https://images.unsplash.com/photo-1486572788966-cfd3df1f5b42?w=800',
//     tag: null,
//     description: 'Next-gen gaming console with 1TB storage and two wireless controllers.'
//   }
// ];

// export function getProductById(id) {
//   return products.find(p => p.id === Number(id));
// }

// export function getRelatedProducts(product, limit = 4) {
//   const same = products.filter(p => p.category === product.category && p.id !== product.id);
//   const others = products.filter(p => p.category !== product.category);
//   return [...same, ...others].slice(0, limit);
// }

// export function getReservableProducts() {
//   return products.filter(p => p.price > 5000);
// }
// export const wishlistIds = [2, 4, 9];

// export function getWishlistProducts() {
//   return products.filter(p => wishlistIds.includes(p.id));
// }





// import api from './api';

// export async function getProducts() {
//   const response = await api.get('/api/products');
//   return response.data;
// }

// export async function getProductById(id) {
//   const response = await api.get(`/api/products/${id}`);
//   return response.data;
// }


// export async function getRelatedProducts(productId) {
//   const response = await api.get(`/api/products/${productId}/related`);
//   return response.data;
// }

// import api from './api';

// export async function createProduct(product) {
//   const response = await api.post('/api/products', product);
//   return response.data;
// }

// export async function getProducts(storeId) {
//   const response = await api.get('/api/products', { params: { store_id: storeId } });
//   return response.data;
// }


// export async function getReservableProducts() {
//   const response = await api.get('/api/products/reservable'); // অথবা আপনার ব্যাকএন্ডের সঠিক রাউটটি দিন
//   return response.data;
// }

import api from './api';

function normalizeProduct(product) {
  return {
    ...product,
    id: product.product_id || product.id,
    stock: product.stock_qty ?? product.stock ?? 0,
    store: product.store_name || product.store || 'Local store',
    category: product.category_name || product.category || 'General',
    image: product.image || product.image_url || 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800',
  };
}

export async function createProduct(product) {
  const response = await api.post('/api/products', product);
  return response.data;
}

export async function updateProduct(productId, product) {
  const response = await api.patch(`/api/products/${productId}`, product);
  return response.data.product;
}

export async function deleteProduct(productId) {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data.product;
}

export async function getProducts(storeId) {
  const response = await api.get('/api/products', { params: { store_id: storeId } });
  return response.data.map(normalizeProduct);
}


export async function getProductById(id) {
  const response = await api.get(`/api/products/${id}`);
  return normalizeProduct(response.data);
}

export async function getReservableProducts() {
  const response = await api.get('/api/products/reservable');
  return response.data;
}

export async function getRelatedProducts(productId) {
  const response = await api.get('/api/products');
  const currentId = typeof productId === 'object' ? productId.id : Number(productId);
  return response.data
    .map(normalizeProduct)
    .filter((product) => product.id !== currentId)
    .slice(0, 4);
}
export async function getWishlistProducts() {
  const response = await api.get('/api/wishlist');
  return response.data.map((product) => ({
    ...normalizeProduct(product),
    wishlist_id: product.wishlist_id,
    id: product.product_id || product.id,
  }));
}