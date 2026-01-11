import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/ForgotPassword.css';

const ForgotPassword = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Reset link sent!');
    } catch (err) {
      setMessage('Error sending reset link');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card">
        <h3 className="modal-title">Forgot Password</h3>
        <form onSubmit={handleSubmit} className="forgot-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field"
            required
          />
          <button type="submit" className="submit-btn">Send Reset Link</button>
        </form>
        {message && <p className="message">{message}</p>}
        <button onClick={onClose} className="close-btn">Close</button>
      </div>
    </div>
  );
};

export default ForgotPassword;