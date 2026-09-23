// export const reservations = [
//   {
//     id: 'RES-101',
//     product: 'Smart Watch Pro',
//     store: 'Tech Haven',
//     price: 5490,
//     date: 'Aug 12, 2026',
//     time: '5:00 PM',
//     notes: 'Want to check the strap options',
//     status: 'Confirmed'
//   },
//   {
//     id: 'RES-102',
//     product: '4K Action Camera',
//     store: 'Tech Haven',
//     price: 6990,
//     date: 'Aug 15, 2026',
//     time: '12:30 PM',
//     notes: '',
//     status: 'Pending'
//   },
//   {
//     id: 'RES-097',
//     product: 'Gaming Console X',
//     store: 'Tech Haven',
//     price: 8990,
//     date: 'Jul 28, 2026',
//     time: '4:00 PM',
//     notes: 'Demo before purchase',
//     status: 'Completed'
//   },
//   {
//     id: 'RES-090',
//     product: 'Smart Watch Pro',
//     store: 'Tech Haven',
//     price: 5490,
//     date: 'Jul 20, 2026',
//     time: '6:00 PM',
//     notes: '',
//     status: 'Cancelled'
//   }
// ];

// export function getReservations() {
//   return reservations;
// }



// import api from './api';

// export async function getReservations() {
//   const response = await api.get('/api/reservations');
//   return response.data;
// }

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