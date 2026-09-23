import api from './api';

export async function getVendorOrders() {
  const response = await api.get('/api/orders/vendor');
  return response.data;
}

export async function getVendorReservations() {
  const response = await api.get('/api/reservations/vendor/me');
  return response.data;
}

export async function updateVendorReservation(reservationId, status) {
  const response = await api.patch(
    `/api/reservations/${reservationId}/status`,
    { status }
  );
  return response.data;
}

export async function updateOrderStatus(orderId, status) {

  const response = await api.patch(
    `/api/orders/${orderId}/status`,
    {
      status
    }
  );

  return response.data;

}

export async function getVendorReviews(){

 const response = await api.get(
   "/api/reviews/vendor"
 );

 return response.data;

}

export async function getVendorProducts(){

const response = await api.get(
"/api/products/vendor/me"
);

return response.data;

}