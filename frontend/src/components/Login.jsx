import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';  // Import updated CSS

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (role) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', { ...form, role });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('role', response.data.role);
      alert('Login successful!');
      navigate('/dashboard');  // Replace with your dashboard route
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-header">
        <div className="logo">👗</div>  {/* Replace with your logo image */}
        <h1 className="app-name">Style U</h1>
        <p className="tagline">Your Personal AI Fashion Assistant</p>
      </div>
      <div className="login-card">
        <h2 className="form-title">Welcome Back</h2>
        <form className="login-form">
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-links">
            <a href="#" onClick={() => navigate('/forgot-password')}>Forgot Password?</a>
          </div>
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => handleSubmit('user')}
            disabled={loading}
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => handleSubmit('admin')}
            disabled={loading}
          >
            Admin Login
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="switch-link">
          Don’t have an account? <a href="#" onClick={() => navigate('/signup')}>Sign Up</a>
        </p>
      </div>
    </div>
  );
};

export default Login;