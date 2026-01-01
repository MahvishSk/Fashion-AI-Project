import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/ForgotPassword.css';  // New CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);  // 1: email, 2: reset
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      alert('Check console for reset token (in real app, check email)');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending reset token');
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await axios.post('http://localhost:5000/api/auth/reset-password', { token, newPassword });
      alert('Password reset successfully!');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-page">
      <div className="forgot-header">
        <div className="logo">👗</div>
        <h1 className="app-name">Style U</h1>
        <p className="tagline">AI-Powered Outfit Recommendations</p>
      </div>
      <div className="forgot-card">
        <h2 className="form-title">Forgot Password</h2>
        {step === 1 ? (
          <form onSubmit={handleEmailSubmit} className="forgot-form">
            <div className="form-group">
              <input
                type="email"
                placeholder="Enter your email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send Reset Token'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleResetSubmit} className="forgot-form">
            <div className="form-group">
              <input
                type="text"
                placeholder="Reset Token"
                className="form-control"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="New Password"
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
          </form>
        )}
        {error && <p className="error-message">{error}</p>}
        <p className="switch-link">
          <button className="btn btn-link" onClick={() => navigate('/login')}>Back to Login</button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;