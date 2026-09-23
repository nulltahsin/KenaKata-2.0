import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const roleHome = (role) => {
    if (role === 'ADMIN') return '/admin/dashboard';
    return role === 'VENDOR' ? '/seller/dashboard' : '/profile';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const user = await login(email, password);
      navigate(roleHome(user.role));
    } catch (error) {
      setError(error.response?.data?.message || 'Invalid email or password');
    }
  };

  return (
    <div className="auth-page">
      <Navbar />
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-tabs">
            <Link to="/login" className="auth-tab active">Log in</Link>
            <Link to="/register" className="auth-tab">Sign up</Link>
          </div>

          <h1>Welcome back</h1>
          <p>Sign in to your KenaKata account</p>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-field">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
              />
            </div>
            <div className="form-field">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                required
              />
            </div>
            {error && <div className="auth-error">{error}</div>}
            <button type="submit" className="auth-submit">Sign in</button>
          </form>

          <p className="auth-switch">
            New to KenaKata? <Link to="/register">Create an account</Link>
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Login;
