

import api from './api';

export async function getReservations() {
  const response = await api.get('/api/reservations');
  return response.data.map((reservation) => ({
    ...reservation,
    id: reservation.reservation_id,
    product: reservation.product_name || reservation.product || 'Product',
    store: reservation.store_name || reservation.store || 'Store',
    image: reservation.product_image || reservation.image_url || reservation.image || '',
    price: reservation.product_price || reservation.price || null,
    location: reservation.store_location || reservation.location || '',
    date: reservation.created_at || reservation.deadline,
    quantity: reservation.quantity || 1,
    status: reservation.status || 'Pending',
  }));
}

export async function createReservation(payload) {
  const response = await api.post('/api/reservations', payload);
  return response.data;
}