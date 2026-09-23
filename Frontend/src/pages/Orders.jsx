import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import OrderCard from '../components/OrderCard';
import { getOrders } from '../services/orderService';
import './Orders.css';

function Orders() {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const data = await getOrders();
        setOrders(data);
      } catch (error) {
        console.error("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

const statuses = [
  'all',
  'Pending',
  'Confirmed',
  'Shipped',
  'Delivered',
  'Cancelled'
];

  const filteredOrders =
    filter === 'all'
      ? orders
      : orders.filter(o => o.status === filter);

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className="orders-page">
      <Navbar />

      <div className="orders-container">
        <div className="orders-header">
          <h1>My Orders</h1>
          <p>Track and manage your orders</p>
        </div>

        <div className="orders-tabs">
          {statuses.map(s => (
            <button
              key={s}
              className={`orders-tab ${filter === s ? 'active' : ''}`}
              onClick={() => setFilter(s)}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        <div className="orders-list">
          {filteredOrders.map(order => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>

        {!loading && filteredOrders.length === 0 && (
          <div className="orders-empty">
            <h3>No orders found</h3>

            <p>
              You have no{' '}
              {filter !== 'all' ? filter.toLowerCase() : ''}{' '}
              orders yet.
            </p>

            <Link
              to="/products"
              className="shop-btn"
            >
              Start Shopping
            </Link>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

export default Orders;

