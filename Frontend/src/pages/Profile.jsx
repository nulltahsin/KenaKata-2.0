import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './Profile.css';
import { getCustomerProfile, getVendorProfile, updateCustomerProfile, updateVendorProfile } from '../services/authService';

function Profile() {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [form, setForm] = useState({ name: user.name, email: user.email, phone: '', delivery_address: '', business_name: '', current_password: '', new_password: '', confirm_password: '' });

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const openEditor = async () => {
    setError('');
    if (user.role === 'VENDOR') {
      try {
        const profile = await getVendorProfile(user.id);
        setForm({ name: profile.name || user.name, email: profile.email || user.email, phone: profile.phone || '', business_name: profile.business_name || '', current_password: '', new_password: '', confirm_password: '' });
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load profile.');
        return;
      }
    } else if (user.role === 'CUSTOMER') {
      try {
        const profile = await getCustomerProfile(user.id);
        setForm({ name: profile.name || user.name, email: profile.email || user.email, phone: profile.phone || '', delivery_address: profile.delivery_address || '', business_name: '', current_password: '', new_password: '', confirm_password: '' });
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load profile.');
        return;
      }
    }
    setEditing(true);
  };

  const handleSave = async (event) => {
    event.preventDefault();
    if (form.new_password && form.new_password !== form.confirm_password) {
      setError('New passwords do not match.');
      return;
    }
    setSaving(true);
    setError('');
    try {
      if (user.role === 'CUSTOMER') {
        await updateCustomerProfile(user.id, {
          name: form.name,
          phone: form.phone,
          delivery_address: form.delivery_address,
          current_password: form.current_password,
          new_password: form.new_password,
        });
        updateUser({ name: form.name });
      } else {
        const profile = {
          name: form.name,
          email: form.email,
          phone: form.phone,
          business_name: form.business_name,
          current_password: form.current_password,
          new_password: form.new_password,
        };
        await updateVendorProfile(user.id, profile);
        updateUser({ name: form.name, email: form.email });
      }
      setEditing(false);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const initials = user.name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const links = [
    ...(user.role === 'VENDOR'
      ? [{ to: '/seller/dashboard', label: 'Vendor Dashboard', desc: 'Manage your shop and sales' }]
      : []),
    ...(user.role === 'CUSTOMER'
      ? [
          { to: '/orders', label: 'My Orders', desc: 'Track your orders' },
          { to: '/wishlist', label: 'Wishlist', desc: 'Saved products' },
          { to: '/reservations', label: 'Reservations', desc: 'Store visit bookings' },
          { to: '/cart', label: 'Cart', desc: 'Items in your cart' },
        ]
      : []),
    ...(user.role === 'ADMIN'
      ? [{ to: '/admin/dashboard', label: 'Manage Markets', desc: 'Add and manage marketplace locations' }]
      : []),

  ];

  return (
    <div className="profile-page">
      <Navbar />

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-avatar">{initials}</div>
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p>{user.email}</p>
            <span className="profile-role">{user.role}</span>
          </div>
          <div className="profile-actions">
            {['VENDOR', 'CUSTOMER'].includes(user.role) && <button className="profile-edit" onClick={openEditor}>Edit profile</button>}
            <button className="profile-logout" onClick={handleLogout}>Logout</button>
          </div>
        </div>

        {editing && <form className="profile-edit-form" onSubmit={handleSave}>
          <h2>Edit profile</h2>
          <label>Full name<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
          {user.role === 'VENDOR' && <label>Email address<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>}
          <label>Phone<input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} placeholder="01XXXXXXXXX" /></label>
          {user.role === 'CUSTOMER' && <label>Delivery address<input value={form.delivery_address} onChange={(event) => setForm({ ...form, delivery_address: event.target.value })} placeholder="Your delivery address" /></label>}
          {user.role === 'CUSTOMER' && <>
            <div className="profile-security-heading"><h3>Change password</h3><span>Leave blank to keep your current password.</span></div>
            <label>Current password<input type="password" autoComplete="current-password" value={form.current_password} onChange={(event) => setForm({ ...form, current_password: event.target.value })} placeholder="Required to change password" /></label>
            <label>New password<input type="password" autoComplete="new-password" minLength="6" value={form.new_password} onChange={(event) => setForm({ ...form, new_password: event.target.value })} placeholder="At least 6 characters" /></label>
            <label>Confirm new password<input type="password" autoComplete="new-password" minLength="6" value={form.confirm_password} onChange={(event) => setForm({ ...form, confirm_password: event.target.value })} placeholder="Repeat new password" /></label>
          </>}
          {user.role === 'VENDOR' && <label>Business name<input value={form.business_name} onChange={(event) => setForm({ ...form, business_name: event.target.value })} required /></label>}
          {user.role === 'VENDOR' && <>
            <div className="profile-security-heading"><h3>Change password</h3><span>Leave blank to keep your current password.</span></div>
            <label>Current password<input type="password" value={form.current_password} onChange={(event) => setForm({ ...form, current_password: event.target.value })} placeholder="Required for password change" /></label>
            <label>New password<input type="password" minLength="6" value={form.new_password} onChange={(event) => setForm({ ...form, new_password: event.target.value })} placeholder="At least 6 characters" /></label>
            <label>Confirm new password<input type="password" minLength="6" value={form.confirm_password} onChange={(event) => setForm({ ...form, confirm_password: event.target.value })} placeholder="Repeat new password" /></label>
          </>}
          {error && <p className="profile-error">{error}</p>}
          <div className="profile-form-actions"><button type="submit" className="profile-save" disabled={saving}>{saving ? 'Saving...' : 'Save changes'}</button><button type="button" className="profile-cancel" onClick={() => setEditing(false)}>Cancel</button></div>
        </form>}

        <div className="profile-links">
          {links.map(l => (
            <Link to={l.to} key={l.to} className="profile-link-card">
              <strong>{l.label}</strong>
              <span>{l.desc}</span>
            </Link>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Profile;
