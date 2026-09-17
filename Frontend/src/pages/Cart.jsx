// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Toast from '../components/Toast';
// import './Cart.css';

// function Cart() {
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       name: 'Premium Oversized Tee',
//       store: 'Urban Thread',
//       price: 1290,
//       quantity: 1,
//       image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
//     },
//     {
//       id: 4,
//       name: 'Classic Leather Wallet',
//       store: 'The Leather Co.',
//       price: 1850,
//       quantity: 2,
//       image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
//     }
//   ]);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');

//   const DELIVERY_FEE = 60;

//   const updateQuantity = (id, delta) => {
//     setItems(prev => prev.map(item => {
//       if (item.id === id) {
//         const newQty = Math.max(1, item.quantity + delta);
//         return { ...item, quantity: newQty };
//       }
//       return item;
//     }));
//   };

//   const removeItem = (id) => {
//     const item = items.find(i => i.id === id);
//     setItems(prev => prev.filter(i => i.id !== id));
//     setToastMsg(`${item.name} removed from cart`);
//     setShowToast(true);
//   };

//   const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const total = items.length > 0 ? subtotal + DELIVERY_FEE : 0;
//   const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

//   if (items.length === 0) {
//     return (
//       <div className="cart-page">
//         <Navbar />
//         <div className="cart-container">
//           <div className="cart-empty">
//             <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//               <circle cx="9" cy="21" r="1"></circle>
//               <circle cx="20" cy="21" r="1"></circle>
//               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
//             </svg>
//             <h2>Your cart is empty</h2>
//             <p>Looks like you have not added anything yet.</p>
//             <Link to="/products" className="shop-btn">Start Shopping</Link>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page">
//       <Navbar />

//       <div className="cart-container">
//                 <div className="cart-header">
//           <div>
//             <h1>Your Cart</h1>
//             <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
//           </div>
//           <Link to="/reservations" className="cross-link">View Reservations →</Link>
//         </div>

//         <div className="cart-layout">
//           <div className="cart-items">
//             {items.map(item => (
//               <div key={item.id} className="cart-item">
//                 <div className="cart-item-image">
//                   <img src={item.image} alt={item.name} />
//                 </div>
//                 <div className="cart-item-info">
//                   <div className="cart-item-top">
//                     <div>
//                       <h3>{item.name}</h3>
//                       <p className="cart-item-store">{item.store}</p>
//                     </div>
//                     <button
//                       className="cart-remove-btn"
//                       onClick={() => removeItem(item.id)}
//                       aria-label="Remove"
//                     >
//                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"></path>
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="cart-item-bottom">
//                     <div className="quantity-box">
//                       <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease">−</button>
//                       <span>{item.quantity}</span>
//                       <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase">+</button>
//                     </div>
//                     <span className="cart-item-price">৳{item.price * item.quantity}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <aside className="cart-summary">
//             <h2>Order Summary</h2>
//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span>৳{subtotal}</span>
//             </div>
//             <div className="summary-row">
//               <span>Delivery Fee</span>
//               <span>৳{DELIVERY_FEE}</span>
//             </div>
//             <div className="summary-row total">
//               <span>Total</span>
//               <span>৳{total}</span>
//             </div>
//             <Link to="/checkout" className="checkout-btn">
//               Proceed to Checkout
//             </Link>
//             <Link to="/products" className="continue-link">
//               ← Continue Shopping
//             </Link>
//           </aside>
//         </div>
//       </div>

//       <Footer />
//       <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
//     </div>
//   );
// }

// export default Cart;
// import { useState } from 'react';
// import { Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Toast from '../components/Toast';
// import './Cart.css';

// function Cart() {
//   const [items, setItems] = useState([
//     {
//       id: 1,
//       name: 'Premium Oversized Tee',
//       store: 'Urban Thread',
//       price: 1290,
//       quantity: 1,
//       image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500'
//     },
//     {
//       id: 4,
//       name: 'Classic Leather Wallet',
//       store: 'The Leather Co.',
//       price: 1850,
//       quantity: 2,
//       image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=500'
//     }
//   ]);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');

//   const DELIVERY_FEE = 60;

//   const updateQuantity = (id, delta) => {
//     setItems(prev => prev.map(item => {
//       if (item.id === id) {
//         const newQty = Math.max(1, item.quantity + delta);
//         return { ...item, quantity: newQty };
//       }
//       return item;
//     }));
//   };

//   const removeItem = (id) => {
//     const item = items.find(i => i.id === id);
//     setItems(prev => prev.filter(i => i.id !== id));
//     setToastMsg(`${item.name} removed from cart`);
//     setShowToast(true);
//   };

//   const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
//   const total = items.length > 0 ? subtotal + DELIVERY_FEE : 0;
//   const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

//   if (items.length === 0) {
//     return (
//       <div className="cart-page">
//         <Navbar />
//         <div className="cart-container">
//           <div className="cart-empty">
//             <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
//               <circle cx="9" cy="21" r="1"></circle>
//               <circle cx="20" cy="21" r="1"></circle>
//               <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
//             </svg>
//             <h2>Your cart is empty</h2>
//             <p>Looks like you have not added anything yet.</p>
//             <Link to="/products" className="shop-btn">Start Shopping</Link>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     );
//   }

//   return (
//     <div className="cart-page">
//       <Navbar />

//       <div className="cart-container">
//         <div className="cart-header">
//           <div>
//             <h1>Your Cart</h1>
//             <p>{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
//           </div>
//           <Link to="/reservations" className="header-secondary-btn">View Reservations</Link>
//         </div>

//         <div className="cart-layout">
//           <div className="cart-items">
//             {items.map(item => (
//               <div key={item.id} className="cart-item">
//                 <div className="cart-item-image">
//                   <img src={item.image} alt={item.name} />
//                 </div>
//                 <div className="cart-item-info">
//                   <div className="cart-item-top">
//                     <div>
//                       <h3>{item.name}</h3>
//                       <p className="cart-item-store">{item.store}</p>
//                     </div>
//                     <button
//                       className="cart-remove-btn"
//                       onClick={() => removeItem(item.id)}
//                       aria-label="Remove"
//                     >
//                       <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                         <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"></path>
//                       </svg>
//                     </button>
//                   </div>
//                   <div className="cart-item-bottom">
//                     <div className="quantity-box">
//                       <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease">−</button>
//                       <span>{item.quantity}</span>
//                       <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase">+</button>
//                     </div>
//                     <span className="cart-item-price">৳{item.price * item.quantity}</span>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <aside className="cart-summary">
//             <h2>Order Summary</h2>
//             <div className="summary-row">
//               <span>Subtotal</span>
//               <span>৳{subtotal}</span>
//             </div>
//             <div className="summary-row">
//               <span>Delivery Fee</span>
//               <span>৳{DELIVERY_FEE}</span>
//             </div>
//             <div className="summary-row total">
//               <span>Total</span>
//               <span>৳{total}</span>
//             </div>
//             <Link to="/checkout" className="checkout-btn">
//               Proceed to Checkout
//             </Link>
//             <Link to="/products" className="continue-link">
//               ← Continue Shopping
//             </Link>
//           </aside>
//         </div>
//       </div>

//       <Footer />
//       <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
//     </div>
//   );
// }

// export default Cart;

import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { useCart } from '../context/CartContext';
import api from '../services/api';
import './Cart.css';

function Cart() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeFromCart, clearCart, cartTotal, cartCount } = useCart();
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const DELIVERY_FEE = 60;
  const total = items.length > 0 ? cartTotal + DELIVERY_FEE : 0;

  const expiryByItem = useMemo(() => {
    return items.reduce((acc, item) => {
      if (item.expires_at) acc[item.id] = new Date(item.expires_at).getTime();
      return acc;
    }, {});
  }, [items]);

  useEffect(() => {
    if (!items.length) return;

    const timer = setInterval(() => {
      const now = Date.now();
      const expiredItems = Object.entries(expiryByItem).filter(([, expiresAt]) => expiresAt <= now);

      if (expiredItems.length > 0) {
        (async () => {
          try {
            await api.post('/api/cart/release-expired');
            await clearCart();
            setToastMsg('Cart expired. Reserved stock has been released.');
            setShowToast(true);
            navigate('/products');
          } catch (error) {
            console.error('Cart expiry cleanup failed:', error);
          }
        })();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [clearCart, expiryByItem, items.length, navigate]);

  const handleRemove = (id) => {
    const item = items.find(i => i.id === id);
    removeFromCart(id);
    setToastMsg(`${item.name} removed from cart`);
    setShowToast(true);
  };

  if (items.length === 0) {
    return (
      <div className="cart-page">
        <Navbar />
        <div className="cart-container">
          <div className="cart-empty">
            <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            <h2>Your cart is empty</h2>
            <p>Looks like you have not added anything yet.</p>
            <Link to="/products" className="shop-btn">Start Shopping</Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="cart-page">
      <Navbar />

      <div className="cart-container">
        <div className="cart-header">
          <div>
            <h1>Your Cart</h1>
            <p>{cartCount} {cartCount === 1 ? 'item' : 'items'}</p>
          </div>
          <Link to="/reservations" className="header-secondary-btn">View Reservations</Link>
        </div>

        <div className="cart-layout">
          <div className="cart-items">
            {items.map(item => {
              const expiryAt = expiryByItem[item.id] || (Date.now() + 60 * 60 * 1000);
              const remainingMs = Math.max(0, expiryAt - Date.now());
              const minutes = Math.floor(remainingMs / 60000);
              const seconds = Math.floor((remainingMs % 60000) / 1000);

              return (
                <div key={item.id} className="cart-item">
                  <div className="cart-item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="cart-item-info">
                    <div className="cart-item-top">
                      <div>
                        <h3>{item.name}</h3>
                        <p className="cart-item-store">{item.store}</p>
                      </div>
                      <button
                        className="cart-remove-btn"
                        onClick={() => handleRemove(item.id)}
                        aria-label="Remove"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14"></path>
                        </svg>
                      </button>
                    </div>
                    <div className="cart-item-bottom">
                      <div className="quantity-box">
                        <button onClick={() => updateQuantity(item.id, -1)} aria-label="Decrease">−</button>
                        <span>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, 1)} aria-label="Increase">+</button>
                      </div>
                      <span className="cart-item-price">৳{item.price * item.quantity}</span>
                    </div>
                    <div className="cart-expiry">Hold expires in {minutes}:{String(seconds).padStart(2, '0')}</div>
                  </div>
                </div>
              );
            })}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>৳{cartTotal}</span>
            </div>
            <div className="summary-row">
              <span>Delivery Fee</span>
              <span>৳{DELIVERY_FEE}</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>৳{total}</span>
            </div>
            <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
            <Link to="/products" className="continue-link">← Continue Shopping</Link>
          </aside>
        </div>
      </div>

      <Footer />
      <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
    </div>
  );
}

export default Cart;