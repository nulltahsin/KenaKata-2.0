// import { useNavigate } from 'react-router-dom';
// import './BookingButton.css';

// function BookingButton({ storeName }) {
//   const navigate = useNavigate();

//   const handleClick = (e) => {
//     e.preventDefault();
//     e.stopPropagation();
//     navigate(`/reservations?new=1&store=${encodeURIComponent(storeName || '')}`);
//   };

//   return (
//     <button className="booking-btn" onClick={handleClick}>
//       <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//         <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//         <line x1="16" y1="2" x2="16" y2="6"></line>
//         <line x1="8" y1="2" x2="8" y2="6"></line>
//         <line x1="3" y1="10" x2="21" y2="10"></line>
//       </svg>
//       Reserve
//     </button>
//   );
// }

// export default BookingButton;
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import './BookingButton.css';

function BookingButton({ storeName, productName, productId, storeId, label = 'Reserve', className = '', onSuccess }) {
  const navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const resolvedProductId = Number(productId) || null;
      const resolvedStoreId = Number(storeId) || null;
      await api.post('/api/reservations', {
        product_id: resolvedProductId,
        productId: resolvedProductId,
        store_id: resolvedStoreId,
        storeId: resolvedStoreId,
        deadline: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
      });

      sessionStorage.setItem('reservation_toast', 'Reserved successfully!');
      onSuccess?.();
      navigate('/reservations');
    } catch (error) {
      console.error('Reservation failed:', error);
      onSuccess?.(error?.response?.data?.message || 'Unable to create reservation.');
    }
  };

  return (
    <button className={`booking-btn ${className}`} onClick={handleClick}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="3" y="4" width="18" height="18" rx="2"></rect>
        <line x1="16" y1="2" x2="16" y2="6"></line>
        <line x1="8" y1="2" x2="8" y2="6"></line>
        <line x1="3" y1="10" x2="21" y2="10"></line>
      </svg>
      {label}
    </button>
  );
}

export default BookingButton;