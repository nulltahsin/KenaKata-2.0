// import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Toast from '../components/Toast';
// import { reservations as initialReservations } from '../services/reservationService';
// import { stores } from '../services/storeService';
// import './Reservations.css';

// function Reservations() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const showForm = searchParams.get('new') === '1';
//   const presetStore = searchParams.get('store') || '';

//   const [filter, setFilter] = useState('all');
//   const [list, setList] = useState(initialReservations);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [form, setForm] = useState({
//     store: presetStore,
//     date: '',
//     time: '',
//     people: '2',
//     notes: ''
//   });

//   const statuses = ['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

//   const filtered = filter === 'all' ? list : list.filter(r => r.status === filter);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.store || !form.date || !form.time) {
//       setToastMsg('Please select store, date and time');
//       setShowToast(true);
//       return;
//     }
//     const newReservation = {
//       id: `RES-${100 + list.length + 1}`,
//       store: form.store,
//       date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       time: form.time,
//       people: Number(form.people),
//       notes: form.notes,
//       status: 'Pending'
//     };
//     setList([newReservation, ...list]);
//     setSearchParams({});
//     setForm({ store: '', date: '', time: '', people: '2', notes: '' });
//     setToastMsg('Reservation request submitted');
//     setShowToast(true);
//   };

//   return (
//     <div className="reservations-page">
//       <Navbar />

//       <div className="reservations-container">
//         <div className="reservations-header">
//           <div>
//             <h1>My Reservations</h1>
//             <p>Manage your store visits and bookings</p>
//           </div>
//           {!showForm && (
//             <button className="new-reservation-btn" onClick={() => setSearchParams({ new: '1' })}>
//               + New Reservation
//             </button>
//           )}
//         </div>

//         {showForm && (
//           <form className="reservation-form" onSubmit={handleSubmit}>
//             <div className="reservation-form-head">
//               <h2>Book a store visit</h2>
//               <button type="button" className="form-close" onClick={() => setSearchParams({})}>✕</button>
//             </div>
//             <div className="reservation-form-grid">
//               <div className="form-field">
//                 <label>Store</label>
//                 <select name="store" value={form.store} onChange={handleChange}>
//                   <option value="">Select a store</option>
//                   {stores.map(s => (
//                     <option key={s.id} value={s.name}>{s.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-field">
//                 <label>Date</label>
//                 <input type="date" name="date" value={form.date} onChange={handleChange} />
//               </div>
//               <div className="form-field">
//                 <label>Time</label>
//                 <input type="time" name="time" value={form.time} onChange={handleChange} />
//               </div>
//               <div className="form-field">
//                 <label>People</label>
//                 <select name="people" value={form.people} onChange={handleChange}>
//                   {['1', '2', '3', '4', '5', '6'].map(n => (
//                     <option key={n} value={n}>{n}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-field full">
//                 <label>Notes (optional)</label>
//                 <textarea
//                   name="notes"
//                   value={form.notes}
//                   onChange={handleChange}
//                   rows="2"
//                   placeholder="Purpose of visit..."
//                 />
//               </div>
//             </div>
//             <button type="submit" className="submit-reservation">Request Reservation</button>
//           </form>
//         )}

//         <div className="reservations-tabs">
//           {statuses.map(s => (
//             <button
//               key={s}
//               className={`reservations-tab ${filter === s ? 'active' : ''}`}
//               onClick={() => setFilter(s)}
//             >
//               {s === 'all' ? 'All' : s}
//             </button>
//           ))}
//         </div>

//         <div className="reservations-grid">
//           {filtered.map(r => (
//             <div key={r.id} className="reservation-card">
//               <div className="reservation-card-header">
//                 <span className="reservation-id">{r.id}</span>
//                 <span className={`reservation-status ${r.status.toLowerCase()}`}>{r.status}</span>
//               </div>
//               <div className="reservation-body">
//                 <h3>{r.store}</h3>
//                 <div className="reservation-when">
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//                       <line x1="16" y1="2" x2="16" y2="6"></line>
//                       <line x1="8" y1="2" x2="8" y2="6"></line>
//                       <line x1="3" y1="10" x2="21" y2="10"></line>
//                     </svg>
//                     {r.date}
//                   </span>
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <circle cx="12" cy="12" r="10"></circle>
//                       <polyline points="12 6 12 12 16 14"></polyline>
//                     </svg>
//                     {r.time}
//                   </span>
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//                       <circle cx="9" cy="7" r="4"></circle>
//                     </svg>
//                     {r.people}
//                   </span>
//                 </div>
//                 {r.notes && <p className="reservation-notes">"{r.notes}"</p>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {filtered.length === 0 && (
//           <div className="reservations-empty">
//             <h3>No reservations found</h3>
//             <p>Book a store visit to get started.</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//       <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
//     </div>
//   );
// }

// export default Reservations;
// import { useState } from 'react';
// import { useSearchParams } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Toast from '../components/Toast';
// import { reservations as initialReservations } from '../services/reservationService';
// import { stores } from '../services/storeService';
// import { products } from '../services/productService';
// import './Reservations.css';

// function Reservations() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const showForm = searchParams.get('new') === '1';
//   const presetStore = searchParams.get('store') || '';

//   const [filter, setFilter] = useState('all');
//   const [list, setList] = useState(initialReservations);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [form, setForm] = useState({
//     store: presetStore,
//     date: '',
//     time: '',
//     people: '2',
//     notes: '',
//     selectedProducts: []
//   });

//   const statuses = ['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

//   const filtered = filter === 'all' ? list : list.filter(r => r.status === filter);

//   const storeProducts = products.filter(p => p.store === form.store);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setForm(prev => ({
//       ...prev,
//       [name]: value,
//       ...(name === 'store' ? { selectedProducts: [] } : {})
//     }));
//   };

//   const toggleProduct = (productName) => {
//     setForm(prev => ({
//       ...prev,
//       selectedProducts: prev.selectedProducts.includes(productName)
//         ? prev.selectedProducts.filter(n => n !== productName)
//         : [...prev.selectedProducts, productName]
//     }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.store || !form.date || !form.time) {
//       setToastMsg('Please select store, date and time');
//       setShowToast(true);
//       return;
//     }
//     const newReservation = {
//       id: `RES-${100 + list.length + 1}`,
//       store: form.store,
//       date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       time: form.time,
//       people: Number(form.people),
//       notes: form.notes,
//       products: form.selectedProducts,
//       status: 'Pending'
//     };
//     setList([newReservation, ...list]);
//     setSearchParams({});
//     setForm({ store: '', date: '', time: '', people: '2', notes: '', selectedProducts: [] });
//     setToastMsg('Reservation request submitted');
//     setShowToast(true);
//   };

//   return (
//     <div className="reservations-page">
//       <Navbar />

//       <div className="reservations-container">
//         <div className="reservations-header">
//           <div>
//             <h1>My Reservations</h1>
//             <p>Manage your store visits and bookings</p>
//           </div>
//           {!showForm && (
//             <button className="new-reservation-btn" onClick={() => setSearchParams({ new: '1' })}>
//               + New Reservation
//             </button>
//           )}
//         </div>

//         {showForm && (
//           <form className="reservation-form" onSubmit={handleSubmit}>
//             <div className="reservation-form-head">
//               <h2>Book a store visit</h2>
//               <button type="button" className="form-close" onClick={() => setSearchParams({})}>✕</button>
//             </div>
//             <div className="reservation-form-grid">
//               <div className="form-field">
//                 <label>Store</label>
//                 <select name="store" value={form.store} onChange={handleChange}>
//                   <option value="">Select a store</option>
//                   {stores.map(s => (
//                     <option key={s.id} value={s.name}>{s.name}</option>
//                   ))}
//                 </select>
//               </div>
//               <div className="form-field">
//                 <label>Date</label>
//                 <input type="date" name="date" value={form.date} onChange={handleChange} />
//               </div>
//               <div className="form-field">
//                 <label>Time</label>
//                 <input type="time" name="time" value={form.time} onChange={handleChange} />
//               </div>
//               <div className="form-field">
//                 <label>People</label>
//                 <select name="people" value={form.people} onChange={handleChange}>
//                   {['1', '2', '3', '4', '5', '6'].map(n => (
//                     <option key={n} value={n}>{n}</option>
//                   ))}
//                 </select>
//               </div>

//               {storeProducts.length > 0 && (
//                 <div className="form-field full">
//                   <label>Products to try or reserve (optional)</label>
//                   <div className="product-select-grid">
//                     {storeProducts.map(p => (
//                       <button
//                         type="button"
//                         key={p.id}
//                         className={`product-select-chip ${form.selectedProducts.includes(p.name) ? 'active' : ''}`}
//                         onClick={() => toggleProduct(p.name)}
//                       >
//                         <img src={p.image} alt={p.name} />
//                         <span>{p.name}</span>
//                       </button>
//                     ))}
//                   </div>
//                 </div>
//               )}

//               <div className="form-field full">
//                 <label>Notes (optional)</label>
//                 <textarea
//                   name="notes"
//                   value={form.notes}
//                   onChange={handleChange}
//                   rows="2"
//                   placeholder="Purpose of visit..."
//                 />
//               </div>
//             </div>
//             <button type="submit" className="submit-reservation">Request Reservation</button>
//           </form>
//         )}

//         <div className="reservations-tabs">
//           {statuses.map(s => (
//             <button
//               key={s}
//               className={`reservations-tab ${filter === s ? 'active' : ''}`}
//               onClick={() => setFilter(s)}
//             >
//               {s === 'all' ? 'All' : s}
//             </button>
//           ))}
//         </div>

//         <div className="reservations-grid">
//           {filtered.map(r => (
//             <div key={r.id} className="reservation-card">
//               <div className="reservation-card-header">
//                 <span className="reservation-id">{r.id}</span>
//                 <span className={`reservation-status ${r.status.toLowerCase()}`}>{r.status}</span>
//               </div>
//               <div className="reservation-body">
//                 <h3>{r.store}</h3>
//                 <div className="reservation-when">
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//                       <line x1="16" y1="2" x2="16" y2="6"></line>
//                       <line x1="8" y1="2" x2="8" y2="6"></line>
//                       <line x1="3" y1="10" x2="21" y2="10"></line>
//                     </svg>
//                     {r.date}
//                   </span>
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <circle cx="12" cy="12" r="10"></circle>
//                       <polyline points="12 6 12 12 16 14"></polyline>
//                     </svg>
//                     {r.time}
//                   </span>
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
//                       <circle cx="9" cy="7" r="4"></circle>
//                     </svg>
//                     {r.people}
//                   </span>
//                 </div>
//                 {r.products && r.products.length > 0 && (
//                   <div className="reservation-products">
//                     {r.products.map(name => (
//                       <span key={name}>{name}</span>
//                     ))}
//                   </div>
//                 )}
//                 {r.notes && <p className="reservation-notes">"{r.notes}"</p>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {filtered.length === 0 && (
//           <div className="reservations-empty">
//             <h3>No reservations found</h3>
//             <p>Book a store visit to get started.</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//       <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
//     </div>
//   );
// }

// export default Reservations;

// import { useState } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Toast from '../components/Toast';
// import { reservations as initialReservations } from '../services/reservationService';
// import { products, getReservableProducts } from '../services/productService';
// import './Reservations.css';

// function Reservations() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const showForm = searchParams.get('new') === '1';
//   const presetProduct = searchParams.get('product') || '';

//   const reservable = getReservableProducts();

//   const [filter, setFilter] = useState('all');
//   const [list, setList] = useState(initialReservations);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [form, setForm] = useState({
//     product: presetProduct,
//     date: '',
//     time: '',
//     notes: ''
//   });

//   const statuses = ['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

//   const filtered = filter === 'all' ? list : list.filter(r => r.status === filter);

//   const selectedProduct = products.find(p => p.name === form.product);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.product || !form.date || !form.time) {
//       setToastMsg('Please select product, date and time');
//       setShowToast(true);
//       return;
//     }
//     const newReservation = {
//       id: `RES-${100 + list.length + 1}`,
//       product: form.product,
//       store: selectedProduct.store,
//       price: selectedProduct.price,
//       date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       time: form.time,
//       notes: form.notes,
//       status: 'Pending'
//     };
//     setList([newReservation, ...list]);
//     setSearchParams({});
//     setForm({ product: '', date: '', time: '', notes: '' });
//     setToastMsg('Reservation request submitted');
//     setShowToast(true);
//   };

//   return (
//     <div className="reservations-page">
//       <Navbar />

//       <div className="reservations-container">
//         <div className="reservations-header">
//           <div>
//             <h1>My Reservations</h1>
//             <p>Reserve premium products (above ৳5,000) and manage your bookings</p>
//           </div>
//                     <div className="reservations-header-actions">
//             <Link to="/cart" className="cross-link">View Cart →</Link>
//             {!showForm && (
//               <button className="new-reservation-btn" onClick={() => setSearchParams({ new: '1' })}>
//                 + New Reservation
//               </button>
//             )}
//           </div>
//         </div>

//         {showForm && (
//           <form className="reservation-form" onSubmit={handleSubmit}>
//             <div className="reservation-form-head">
//               <h2>Reserve a product</h2>
//               <button type="button" className="form-close" onClick={() => setSearchParams({})}>✕</button>
//             </div>
//             <div className="reservation-form-grid">
//               <div className="form-field full">
//                 <label>Product (above ৳5,000)</label>
//                 {presetProduct ? (
//                   <div className="reserved-product-box">
//                     <img src={selectedProduct?.image} alt={presetProduct} />
//                     <div>
//                       <strong>{presetProduct}</strong>
//                       <span>{selectedProduct?.store} — ৳{selectedProduct?.price}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <select name="product" value={form.product} onChange={handleChange}>
//                     <option value="">Select a product</option>
//                     {reservable.map(p => (
//                       <option key={p.id} value={p.name}>{p.name} — ৳{p.price}</option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div className="form-field">
//                 <label>Date</label>
//                 <input type="date" name="date" value={form.date} onChange={handleChange} />
//               </div>
//               <div className="form-field">
//                 <label>Time</label>
//                 <input type="time" name="time" value={form.time} onChange={handleChange} />
//               </div>
//               <div className="form-field full">
//                 <label>Notes (optional)</label>
//                 <textarea
//                   name="notes"
//                   value={form.notes}
//                   onChange={handleChange}
//                   rows="2"
//                   placeholder="Anything we should prepare for your visit..."
//                 />
//               </div>
//             </div>
//             <button type="submit" className="submit-reservation">Request Reservation</button>
//           </form>
//         )}

//         <div className="reservations-tabs">
//           {statuses.map(s => (
//             <button
//               key={s}
//               className={`reservations-tab ${filter === s ? 'active' : ''}`}
//               onClick={() => setFilter(s)}
//             >
//               {s === 'all' ? 'All' : s}
//             </button>
//           ))}
//         </div>

//         <div className="reservations-grid">
//           {filtered.map(r => (
//             <div key={r.id} className="reservation-card">
//               <div className="reservation-card-header">
//                 <span className="reservation-id">{r.id}</span>
//                 <span className={`reservation-status ${r.status.toLowerCase()}`}>{r.status}</span>
//               </div>
//               <div className="reservation-body">
//                 <h3>{r.product}</h3>
//                 <p className="reservation-store">{r.store} — ৳{r.price}</p>
//                 <div className="reservation-when">
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//                       <line x1="16" y1="2" x2="16" y2="6"></line>
//                       <line x1="8" y1="2" x2="8" y2="6"></line>
//                       <line x1="3" y1="10" x2="21" y2="10"></line>
//                     </svg>
//                     {r.date}
//                   </span>
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <circle cx="12" cy="12" r="10"></circle>
//                       <polyline points="12 6 12 12 16 14"></polyline>
//                     </svg>
//                     {r.time}
//                   </span>
//                 </div>
//                 {r.notes && <p className="reservation-notes">"{r.notes}"</p>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {filtered.length === 0 && (
//           <div className="reservations-empty">
//             <h3>No reservations found</h3>
//             <p>Reserve a premium product to get started.</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//       <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
//     </div>
//   );
// }

// export default Reservations;

// import { useState } from 'react';
// import { useSearchParams, Link } from 'react-router-dom';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import Toast from '../components/Toast';
// import { reservations as initialReservations } from '../services/reservationService';
// import { products, getReservableProducts } from '../services/productService';
// import './Reservations.css';

// function Reservations() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const showForm = searchParams.get('new') === '1';
//   const presetProduct = searchParams.get('product') || '';

//   const reservable = getReservableProducts();

//   const [filter, setFilter] = useState('all');
//   const [list, setList] = useState(initialReservations);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMsg, setToastMsg] = useState('');
//   const [form, setForm] = useState({
//     product: presetProduct,
//     date: '',
//     time: '',
//     notes: ''
//   });

//   const statuses = ['all', 'Confirmed', 'Pending', 'Completed', 'Cancelled'];

//   const filtered = filter === 'all' ? list : list.filter(r => r.status === filter);

//   const selectedProduct = products.find(p => p.name === form.product);

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!form.product || !form.date || !form.time) {
//       setToastMsg('Please select product, date and time');
//       setShowToast(true);
//       return;
//     }
//     const newReservation = {
//       id: `RES-${100 + list.length + 1}`,
//       product: form.product,
//       store: selectedProduct.store,
//       price: selectedProduct.price,
//       date: new Date(form.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
//       time: form.time,
//       notes: form.notes,
//       status: 'Pending'
//     };
//     setList([newReservation, ...list]);
//     setSearchParams({});
//     setForm({ product: '', date: '', time: '', notes: '' });
//     setToastMsg('Reservation request submitted');
//     setShowToast(true);
//   };

//   return (
//     <div className="reservations-page">
//       <Navbar />

//       <div className="reservations-container">
//         <div className="reservations-header">
//           <div>
//             <h1>My Reservations</h1>
//             <p>Reserve premium products (above ৳5,000) and manage your bookings</p>
//           </div>
//           <div className="reservations-header-actions">
//             <Link to="/cart" className="header-secondary-btn">View Cart</Link>
//             {!showForm && (
//               <button className="new-reservation-btn" onClick={() => setSearchParams({ new: '1' })}>
//                 + New Reservation
//               </button>
//             )}
//           </div>
//         </div>

//         {showForm && (
//           <form className="reservation-form" onSubmit={handleSubmit}>
//             <div className="reservation-form-head">
//               <h2>Reserve a product</h2>
//               <button type="button" className="form-close" onClick={() => setSearchParams({})}>✕</button>
//             </div>
//             <div className="reservation-form-grid">
//               <div className="form-field full">
//                 <label>Product (above ৳5,000)</label>
//                 {presetProduct ? (
//                   <div className="reserved-product-box">
//                     <img src={selectedProduct?.image} alt={presetProduct} />
//                     <div>
//                       <strong>{presetProduct}</strong>
//                       <span>{selectedProduct?.store} — ৳{selectedProduct?.price}</span>
//                     </div>
//                   </div>
//                 ) : (
//                   <select name="product" value={form.product} onChange={handleChange}>
//                     <option value="">Select a product</option>
//                     {reservable.map(p => (
//                       <option key={p.id} value={p.name}>{p.name} — ৳{p.price}</option>
//                     ))}
//                   </select>
//                 )}
//               </div>
//               <div className="form-field">
//                 <label>Date</label>
//                 <input type="date" name="date" value={form.date} onChange={handleChange} />
//               </div>
//               <div className="form-field">
//                 <label>Time</label>
//                 <input type="time" name="time" value={form.time} onChange={handleChange} />
//               </div>
//               <div className="form-field full">
//                 <label>Notes (optional)</label>
//                 <textarea
//                   name="notes"
//                   value={form.notes}
//                   onChange={handleChange}
//                   rows="2"
//                   placeholder="Anything we should prepare for your visit..."
//                 />
//               </div>
//             </div>
//             <button type="submit" className="submit-reservation">Request Reservation</button>
//           </form>
//         )}

//         <div className="reservations-tabs">
//           {statuses.map(s => (
//             <button
//               key={s}
//               className={`reservations-tab ${filter === s ? 'active' : ''}`}
//               onClick={() => setFilter(s)}
//             >
//               {s === 'all' ? 'All' : s}
//             </button>
//           ))}
//         </div>

//         <div className="reservations-grid">
//           {filtered.map(r => (
//             <div key={r.id} className="reservation-card">
//               <div className="reservation-card-header">
//                 <span className="reservation-id">{r.id}</span>
//                 <span className={`reservation-status ${r.status.toLowerCase()}`}>{r.status}</span>
//               </div>
//               <div className="reservation-body">
//                 <h3>{r.product}</h3>
//                 <p className="reservation-store">{r.store} — ৳{r.price}</p>
//                 <div className="reservation-when">
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <rect x="3" y="4" width="18" height="18" rx="2"></rect>
//                       <line x1="16" y1="2" x2="16" y2="6"></line>
//                       <line x1="8" y1="2" x2="8" y2="6"></line>
//                       <line x1="3" y1="10" x2="21" y2="10"></line>
//                     </svg>
//                     {r.date}
//                   </span>
//                   <span>
//                     <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
//                       <circle cx="12" cy="12" r="10"></circle>
//                       <polyline points="12 6 12 12 16 14"></polyline>
//                     </svg>
//                     {r.time}
//                   </span>
//                 </div>
//                 {r.notes && <p className="reservation-notes">"{r.notes}"</p>}
//               </div>
//             </div>
//           ))}
//         </div>

//         {filtered.length === 0 && (
//           <div className="reservations-empty">
//             <h3>No reservations found</h3>
//             <p>Reserve a premium product to get started.</p>
//           </div>
//         )}
//       </div>

//       <Footer />
//       <Toast show={showToast} message={toastMsg} onHide={() => setShowToast(false)} />
//     </div>
//   );
// }

// export default Reservations;


import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import api from '../services/api';
import { getReservations } from '../services/reservationService'; // সঠিক ইমপোর্ট
import './Reservations.css';

function Reservations() {
  const [reservations, setReservations] = useState([]); // এখানে ডেটা সেভ হবে
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const pendingToast = sessionStorage.getItem('reservation_toast');
    if (pendingToast) {
      setToastMessage(pendingToast);
      sessionStorage.removeItem('reservation_toast');
    }

    async function loadReservations() {
      try {
        const data = await getReservations(); // এপিআই কল
        setReservations(data);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      } finally {
        setLoading(false);
      }
    }
    loadReservations();
  }, []);

  const cancelReservation = async (reservationId) => {
    try {
      await api.delete(`/api/reservations/${reservationId}`);
      setReservations((current) => current.filter((reservation) => reservation.id !== reservationId));
      setToastMessage('Reservation cancelled.');
    } catch (error) {
      setToastMessage(error.response?.data?.message || 'Unable to cancel reservation.');
    }
  };

  if (loading) return <div>Loading reservations...</div>;

  return (
    <div className="reservations-page">
      <Navbar />
      <div className="reservations-container">
        <header className="reservations-header">
          <div>
            <p className="reservations-eyebrow">YOUR BOOKINGS</p>
            <h1>My Reservations</h1>
            <p>Keep track of products and store visits you have reserved.</p>
          </div>
          <span className="reservations-count">{reservations.length} {reservations.length === 1 ? 'reservation' : 'reservations'}</span>
        </header>
        {reservations.length === 0 ? (
          <div className="reservations-empty">
            <div className="empty-icon">◷</div>
            <h3>No reservations yet</h3>
            <p>Reserve a product or store and it will appear here.</p>
          </div>
        ) : (
          <div className="reservations-list">
            {reservations.map(res => (
              <div key={res.id} className="reservation-card">
                <div className="reservation-image-wrap">
                  {res.image ? <img src={res.image} alt={res.product} className="reservation-image" /> : <div className="reservation-image-fallback">K</div>}
                </div>
                <div className="reservation-card-content">
                  <div className="reservation-card-topline">
                    <span className="reservation-label">RESERVATION #{res.id}</span>
                    <span className={`reservation-status ${String(res.status).toLowerCase()}`}>{String(res.status).toUpperCase()}</span>
                  </div>
                  <h3>{res.product !== 'Product' ? res.product : res.store}</h3>
                  {res.price !== null && <p className="reservation-price">৳{res.price}</p>}
                  <div className="reservation-details">
                    <span><strong>Store</strong>{res.store}</span>
                    {res.location && <span><strong>Location</strong>{res.location}</span>}
                    <span><strong>Reserved</strong>{new Date(res.date).toLocaleString()}</span>
                  </div>
                  <button type="button" className="reservation-cancel" onClick={() => cancelReservation(res.id)}>Cancel reservation</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
      <Toast show={Boolean(toastMessage)} message={toastMessage} onHide={() => setToastMessage('')} />
    </div>
  );
}

export default Reservations;