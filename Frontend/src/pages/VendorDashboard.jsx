import { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ShopOnboardingForm from '../components/ShopOnboardingForm';
import ProductManagement from '../components/ProductManagement';
import { getMarkets, getVendorStore } from '../services/storeService';
import { getProducts } from '../services/productService';
import { getVendorOrders, getVendorReservations } from '../services/vendorService';
import './VendorDashboard.css';

function VendorDashboard() {
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [activeSection, setActiveSection] = useState('analytics');
  const [editingShop, setEditingShop] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const normalizeStore = (response) => {
    const savedStore = response?.store || response || {};
    return {
      ...savedStore,
      categories: [...new Set(String(savedStore.category || '').split(',').map((tag) => tag.trim()).filter(Boolean))],
    };
  };

  async function loadDashboard() {
    setLoading(true);
    setError('');
    try {
      const [vendorStore, marketList, orderList, reservationList] = await Promise.all([
        getVendorStore(),
        getMarkets(),
        getVendorOrders(),
        getVendorReservations(),
      ]);
      setStore(vendorStore ? normalizeStore(vendorStore) : null);
      setMarkets(marketList);
      setOrders(orderList);
      setReservations(reservationList);
      if (vendorStore) setProducts(await getProducts(vendorStore.store_id));
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to load your vendor dashboard.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    Promise.resolve().then(loadDashboard);
  }, []);

  const handleStoreSaved = (savedStore) => {
    setStore(normalizeStore(savedStore));
    setEditingShop(false);
    setActiveSection('analytics');
    loadDashboard();
  };

  const navigation = [
    ['analytics', 'Overview'],
    ['profile', 'Profile'],
    ['shop', 'Shop details'],
    ['products', 'Products'],
    ['orders', 'Orders'],
    ['reservations', 'Reservations'],
  ];

  return (
    <div className="vendor-page">
      <Navbar />
      <main className="vendor-container">
        <header className="vendor-header"><div><p className="vendor-eyebrow">Seller portal</p><h1>Run your shop</h1><p>Keep your storefront, inventory, and incoming orders in one place.</p></div>{store && <div className="vendor-header-stat"><strong>{products.length}</strong><span>products listed</span></div>}</header>
        {loading && <div className="vendor-loading">Loading your dashboard...</div>}
        {!loading && error && <div className="vendor-error vendor-notice">{error}<button type="button" onClick={loadDashboard}>Try again</button></div>}
        {!loading && !error && !store && <ShopOnboardingForm store={store} markets={markets} onSaved={handleStoreSaved} />}
        {!loading && !error && store && <div className="vendor-workspace">
          <aside className="vendor-sidebar" aria-label="Vendor dashboard sections">
            <div className="vendor-profile-chip">{store.logo_url ? <img className="vendor-shop-logo" src={store.logo_url} alt={`${store.store_name} logo`} /> : <div className="vendor-avatar">{store.store_name.charAt(0).toUpperCase()}</div>}<div><strong>{store.store_name}</strong><span>Vendor account</span></div></div>
            <nav>{navigation.map(([section, label]) => <button key={section} type="button" className={activeSection === section ? 'active' : ''} onClick={() => setActiveSection(section)}>{label}</button>)}</nav>
          </aside>
          <div className="vendor-content">
            {activeSection === 'analytics' && <>
              <section className="vendor-panel"><div className="vendor-panel-heading"><div><p className="vendor-eyebrow">Analytics / sales</p><h2>Shop overview</h2><p>A quick view of your current marketplace activity.</p></div></div><div className="vendor-metric-grid"><div><span>Products</span><strong>{products.length}</strong></div><div><span>Order lines</span><strong>{orders.length}</strong></div><div><span>Reservations</span><strong>{reservations.length}</strong></div><div><span>Shop category</span><strong>{store.category || 'General'}</strong></div></div></section>
              <section className="vendor-panel vendor-overview-shop"><div className="vendor-overview-shop-identity">{store.logo_url ? <img className="vendor-large-logo" src={store.logo_url} alt={`${store.store_name} logo`} /> : <div className="vendor-large-avatar">{store.store_name.charAt(0).toUpperCase()}</div>}<div><p className="vendor-eyebrow">Your storefront</p><h2>{store.store_name}</h2><p>{store.address} {store.market_name ? `, ${store.market_name}` : ''}</p></div></div><button type="button" className="vendor-primary-button" onClick={() => { setActiveSection('shop'); setEditingShop(true); }}>Edit shop profile</button></section>
            </>}
            {activeSection === 'profile' && <section className="vendor-panel"><div className="vendor-panel-heading"><div><p className="vendor-eyebrow">Profile</p><h2>Vendor account</h2><p>Signed in as the account that owns this shop.</p></div></div><div className="vendor-profile-details"><span>Name<strong>{localStorage.getItem('kenakata_user') ? JSON.parse(localStorage.getItem('kenakata_user')).name : 'Vendor'}</strong></span><span>Shop<strong>{store.store_name}</strong></span><span>Location<strong>{store.address}</strong></span></div></section>}
            {activeSection === 'shop' && (editingShop ? <ShopOnboardingForm store={store} markets={markets} onSaved={handleStoreSaved} onCancel={() => setEditingShop(false)} /> : <section className="vendor-panel vendor-shop-summary"><div className="vendor-panel-heading"><div><p className="vendor-eyebrow">Shop details</p><h2>{store.store_name}</h2><p>{store.description || 'Your storefront information.'}</p></div>{store.logo_url ? <img className="vendor-large-logo" src={store.logo_url} alt={`${store.store_name} logo`} /> : <div className="vendor-large-avatar">{store.store_name.charAt(0).toUpperCase()}</div>}</div><div className="vendor-profile-details"><span>Location<strong>{store.address}</strong></span><span>Category<strong>{store.category || 'General'}</strong></span><span>Market<strong>{store.market_name || 'Selected market'}</strong></span></div><button type="button" className="vendor-primary-button" onClick={() => setEditingShop(true)}>Edit shop details</button></section>)}
            {activeSection === 'products' && <ProductManagement store={store} products={products} onProductsChange={setProducts} />}
            {activeSection === 'orders' && <section className="vendor-panel"><div className="vendor-panel-heading"><div><p className="vendor-eyebrow">Sales</p><h2>Orders received</h2><p>Orders containing products from your shop.</p></div><span className="vendor-count">{orders.length} lines</span></div>{orders.length === 0 ? <div className="vendor-empty">No orders have arrived for this shop yet.</div> : <div className="orders-table-wrap"><table className="product-table"><thead><tr><th>Order</th><th>Product</th><th>Qty</th><th>Total</th><th>Status</th></tr></thead><tbody>{orders.map((order) => <tr key={`${order.order_id}-${order.product_id}`}><td>#{order.order_id}</td><td>{order.product_name}</td><td>{order.quantity}</td><td>৳{(Number(order.price_at_purchase) * order.quantity).toFixed(2)}</td><td><span className="order-status">{order.status}</span></td></tr>)}</tbody></table></div>}</section>}
            {activeSection === 'reservations' && <section className="vendor-panel"><div className="vendor-panel-heading"><div><p className="vendor-eyebrow">Reservations</p><h2>Reservation requests</h2><p>Reservations made for products in your shop.</p></div><span className="vendor-count">{reservations.length} total</span></div>{reservations.length === 0 ? <div className="vendor-empty">No reservations have arrived for this shop yet.</div> : <div className="orders-table-wrap"><table className="product-table"><thead><tr><th>Reservation</th><th>Product</th><th>Deadline</th><th>Status</th></tr></thead><tbody>{reservations.map((reservation) => <tr key={reservation.reservation_id}><td>#{reservation.reservation_id}</td><td>{reservation.product_name}</td><td>{new Date(reservation.deadline).toLocaleString()}</td><td><span className="order-status">{reservation.status}</span></td></tr>)}</tbody></table></div>}</section>}
          </div>
        </div>}
      </main>
      <Footer />
    </div>
  );
}

export default VendorDashboard;
