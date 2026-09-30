

import api from './api';

export async function getMarkets() {
  const response = await api.get('/api/markets');
  return response.data;
}

export async function createMarket(marketName, location) {
  const response = await api.post('/api/markets', {
    market_name: marketName,
    location,
  });
  return response.data;
}

export async function getStores() {
  const response = await api.get('/api/stores');
  return response.data;
}

export async function getStoresByMarket(marketId) {
  const response = await api.get(`/api/stores?market_id=${marketId}`);
  return response.data;
}

export async function getVendorStore() {
  const response = await api.get('/api/stores/vendor/me');
  return response.data;
}

export async function createVendorStore(store) {
  const response = await api.post('/api/stores', store);
  return response.data;
}

export async function updateVendorStore(storeId, store) {
  const response = await api.patch(`/api/stores/${storeId}`, store);
  return response.data.store;
}

export async function getCategories() {
  const response = await api.get('/api/categories');
  return response.data;
}