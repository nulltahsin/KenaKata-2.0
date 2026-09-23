import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMarket, getMarkets } from '../services/storeService';
import {
  getAdminMembers,
  getAdminSales,
  getAdminShops,
  getAdminSummary,
} from '../services/adminService';
import './AdminDashboard.css';

const emptySummary = { markets: 0, shops: 0, members: 0, products: 0, sales: { total: 0, orders: 0 } };

function AdminDashboard() {
  const { logout, user } = useAuth();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(emptySummary);
  const [markets, setMarkets] = useState([]);
  const [shops, setShops] = useState([]);
  const [members, setMembers] = useState([]);
  const [sales, setSales] = useState([]);
  const [marketName, setMarketName] = useState('');
  const [location, setLocation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [shopSearchTerm, setShopSearchTerm] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function loadPortal() {
      try {
        const [nextSummary, nextMarkets, nextShops, nextMembers, nextSales] = await Promise.all([
          getAdminSummary(), getMarkets(), getAdminShops(), getAdminMembers(), getAdminSales(),
        ]);
        setSummary(nextSummary);
        setMarkets(nextMarkets);
        setShops(nextShops);
        setMembers(nextMembers);
        setSales(nextSales);
      } catch (loadError) {
        console.error(loadError);
        setError('Could not load the admin data. Please try again.');
      } finally {
        setLoading(false);
      }
    }
    loadPortal();
  }, []);

  async function handleAddMarket(event) {
    event.preventDefault();
    setSaving(true);
    setError('');
    setMessage('');
    try {
      const market = await createMarket(marketName.trim(), location.trim());
      setMarkets((current) => [...current, market]);
      setSummary((current) => ({ ...current, markets: current.markets + 1 }));
      setMarketName('');
      setLocation('');
      setMessage('Market added successfully.');
    } catch (saveError) {
      console.error(saveError);
      setError('Could not add this market.');
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await logout();
    navigate('/login');
  }

  const cards = [
    ['01', 'Total Markets', summary.markets],
    ['02', 'Total Shops', summary.shops],
    ['03', 'Total Members', summary.members],
    ['04', 'Total Products', summary.products],
  ];

  const filteredMarkets = markets.filter((market) => {
    if (!searchTerm) return true;
    const query = searchTerm.toLowerCase();
    return [market.market_name, market.location].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const filteredMembers = members.filter((member) => {
    if (!memberSearchTerm) return true;
    const query = memberSearchTerm.toLowerCase();
    return [member.name, member.email, member.phone, member.area].some((value) => String(value || '').toLowerCase().includes(query));
  });

  const filteredShops = shops.filter((shop) => {
    if (!shopSearchTerm) return true;
    const query = shopSearchTerm.toLowerCase();
    return [shop.store_name, shop.owner_name, shop.market_name].some((value) => String(value || '').toLowerCase().includes(query));
  });

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">
          <div className="admin-brand-wordmark">Kena<span>Kata</span></div>
          <small>ADMIN PORTAL</small>
        </div>
        <div className="admin-profile"><span>{user?.name?.charAt(0) || 'A'}</span><div><strong>{user?.name || 'Administrator'}</strong><small>Administrator</small></div></div>
        <nav className="admin-nav" aria-label="Admin navigation">
          <a className="active" href="#dashboard"><b>01</b>Dashboard</a>
          <a href="#markets"><b>02</b>Markets</a>
          <a href="#shops"><b>03</b>Shops</a>
          <a href="#members"><b>04</b>Members</a>
          <a href="#sales"><b>05</b>Sales</a>
        </nav>
        <button className="admin-logout" type="button" onClick={handleLogout}><b>-&gt;</b> Logout</button>
      </aside>

      <main className="admin-main" id="dashboard">
        <header className="admin-topbar"><div><p className="admin-kicker">KenaKata / Overview</p><h1>Good morning, {user?.name || 'Admin'}</h1></div><span className="admin-live"><i /> Live data</span></header>
        {error && <div className="admin-alert error">{error}</div>}
        {message && <div className="admin-alert success">{message}</div>}

        <section className="admin-stat-grid" aria-label="Platform totals">
          {cards.map(([number, label, value]) => <article className="admin-stat" key={label}><span>{number}</span><strong>{loading ? '--' : value}</strong><p>{label}</p></article>)}
        </section>

        <section className="admin-section" id="markets">
          <div className="admin-section-heading"><div><p className="admin-kicker">01 / Markets</p><h2>Markets</h2></div><span>{filteredMarkets.length} total</span></div>
          <div className="admin-market-layout">
            <form className="admin-panel admin-form" onSubmit={handleAddMarket}><h3>Add a market</h3><p>Keep the marketplace growing with a real location.</p><label htmlFor="market-name">Market name</label><input id="market-name" value={marketName} onChange={(event) => setMarketName(event.target.value)} required placeholder="e.g. Dhanmondi Bazar" /><label htmlFor="market-location">Location</label><input id="market-location" value={location} onChange={(event) => setLocation(event.target.value)} required placeholder="e.g. Dhanmondi, Dhaka" /><button type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add market'}</button></form>
            <div className="admin-panel admin-list-wrap">
              <div className="admin-search-box"><input value={searchTerm} onChange={(event) => setSearchTerm(event.target.value)} placeholder="Search markets..." aria-label="Search markets" /></div>
              <div className="admin-list">{loading ? <p className="admin-empty">Loading markets...</p> : filteredMarkets.length === 0 ? <p className="admin-empty">No matching markets.</p> : filteredMarkets.map((market) => <div className="admin-list-row" key={market.market_id}><span className="admin-avatar">M</span><div><strong>{market.market_name}</strong><small>{market.location}</small></div><em>#{market.market_id}</em></div>)}</div>
            </div>
          </div>
        </section>

        <section className="admin-section" id="shops"><div className="admin-section-heading"><div><p className="admin-kicker">02 / Shops</p><h2>Shop directory</h2></div><span>{filteredShops.length} total</span></div>
          <div className="admin-panel admin-table-wrap">
            <div className="admin-search-box"><input value={shopSearchTerm} onChange={(event) => setShopSearchTerm(event.target.value)} placeholder="Search shops..." aria-label="Search shops" /></div>
            <table><thead><tr><th>Shop</th><th>Owner</th><th>Market</th><th>Products</th></tr></thead><tbody>{filteredShops.length ? filteredShops.map((shop) => <tr key={shop.store_id}><td>{shop.store_name}</td><td>{shop.owner_name}</td><td>{shop.market_name}</td><td>{shop.product_count}</td></tr>) : <tr><td colSpan="4" className="admin-empty">No matching shops.</td></tr>}</tbody></table>
          </div>
        </section>

        <section className="admin-section" id="members"><div className="admin-section-heading"><div><p className="admin-kicker">03 / Members</p><h2>Member list</h2></div><span>{filteredMembers.length} total</span></div>
          <div className="admin-panel admin-table-wrap">
            <div className="admin-search-box"><input value={memberSearchTerm} onChange={(event) => setMemberSearchTerm(event.target.value)} placeholder="Search members..." aria-label="Search members" /></div>
            <table>
              <thead><tr><th>Name</th><th>Email</th></tr></thead>
              <tbody>{filteredMembers.length ? filteredMembers.map((member) => <tr key={member.user_id}><td>{member.name}</td><td>{member.email}</td></tr>) : <tr><td colSpan="2" className="admin-empty">No matching members.</td></tr>}</tbody>
            </table>
          </div>
        </section>

        <section className="admin-section" id="sales"><div className="admin-section-heading"><div><p className="admin-kicker">04 / Sales</p><h2>Sales overview</h2></div><span>{summary.sales.orders || 0} completed orders</span></div><div className="admin-sales-layout"><div className="admin-panel admin-revenue"><small>Total sales</small><strong>BDT {Number(summary.sales.total || 0).toLocaleString()}</strong><p>Based on non-cancelled orders</p></div><div className="admin-panel admin-table-wrap"><table><thead><tr><th>Order</th><th>Customer</th><th>Status</th><th>Amount</th></tr></thead><tbody>{sales.length ? sales.map((sale) => <tr key={sale.order_id}><td>#{sale.order_id}</td><td>{sale.customer_name}</td><td><span className="admin-status">{sale.status}</span></td><td>BDT {Number(sale.total_amount).toLocaleString()}</td></tr>) : <tr><td colSpan="4" className="admin-empty">No sales yet.</td></tr>}</tbody></table></div></div></section>
      </main>
    </div>
  );
}

export default AdminDashboard;