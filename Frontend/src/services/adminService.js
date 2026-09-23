import api from './api';

export async function getAdminSummary() {
  const response = await api.get('/api/admin/summary');
  return response.data;
}

export async function getAdminShops() {
  const response = await api.get('/api/admin/shops');
  return response.data;
}

export async function getAdminMembers() {
  const response = await api.get('/api/admin/members');
  return response.data;
}

export async function getAdminSales() {
  const response = await api.get('/api/admin/sales');
  return response.data;
}