

// export default Navbar;
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import './Navbar.css';
import SearchBar from './SearchBar';

function Navbar() {
  const { cartCount } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const links = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/markets', label: 'Markets' },
    { to: '/stores', label: 'Stores' }
  ];

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={() => setOpen(false)}>
          Kena<span>Kata</span>
        </Link>

        <nav className={`navbar-links ${open ? 'open' : ''}`}>
          {links.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </NavLink>
          ))}
          {user?.role === 'VENDOR' && (
            <NavLink to="/seller/dashboard" onClick={() => setOpen(false)}>
              Seller Portal
            </NavLink>
          )}
          {user ? (
            <>
              <Link to="/profile" className="mobile-user-link" onClick={() => setOpen(false)}>
                Profile
              </Link>
              <button className="mobile-user-link" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="mobile-signin" onClick={() => setOpen(false)}>
                Sign in
              </Link>
              <Link to="/register" className="mobile-register" onClick={() => setOpen(false)}>
                Register
              </Link>
            </>
          )}
        </nav>

        <div className="navbar-actions">
          <SearchBar />
          <Link to="/wishlist" className="icon-btn" aria-label="Wishlist">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
            </svg>
          </Link>
          <Link to="/reservations" className="icon-btn" aria-label="Reservations">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </Link>
          <Link to="/cart" className="icon-btn" aria-label="Cart">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </Link>
          {user ? (
            <>
              <Link to="/profile" className="user-chip">
                <span className="user-avatar">{user.name.charAt(0).toUpperCase()}</span>
                {user.name.split(' ')[0]}
              </Link>
              <button className="logout-btn" onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="signin-btn">Sign in</Link>
              <Link to="/register" className="register-btn">Register</Link>
            </>
          )}
          <button className="menu-btn" onClick={() => setOpen(!open)} aria-label="Menu">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {open ? (
                <path d="M18 6L6 18M6 6l12 12"></path>
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18"></path>
              )}
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}

export default Navbar;