import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Signup.css';  // Import updated CSS

const Signup = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    height: '',
    weight: '',
    bodyShape: '',
    skinTone: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/signup', form);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-header">
        <div className="logo">👗</div>  {/* Replace with your logo image */}
        <h1 className="app-name">Style U</h1>
        <p className="tagline">Your Personal AI Fashion Assistant</p>
      </div>
      <div className="signup-card">
        <h2 className="form-title">Create Account</h2>
        <form onSubmit={handleSubmit} className="signup-form">
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-control"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
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
         {/* <div className="form-row">
            <div className="form-group half">
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                className="form-control"
                value={form.height}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group half">
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                className="form-control"
                value={form.weight}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group half">
              <select
                name="bodyShape"
                className="form-control"
                value={form.bodyShape}
                onChange={handleChange}
                required
              >
                <option value="">Body Shape</option>
                <option value="hourglass">Hourglass</option>
                <option value="rectangle">Rectangle</option>
                <option value="pear">Pear</option>
                <option value="apple">Apple</option>
              </select>
            </div>
            <div className="form-group half">
              <select
                name="skinTone"
                className="form-control"
                value={form.skinTone}
                onChange={handleChange}
                required
              >
                <option value="">Skin Tone</option>
                <option value="fair">Fair</option>
                <option value="medium">Medium</option>
                <option value="olive">Olive</option>
                <option value="tan">Tan</option>
                <option value="dark">Dark</option>
              </select>
            </div>
          </div>*/}
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </button>
          {error && <p className="error-message">{error}</p>}
        </form>
        <p className="switch-link">
          Already have an account? <a href="#" onClick={() => navigate('/login')}>Login</a>
        </p>
      </div>
    </div>
  );
};

export default Signup;