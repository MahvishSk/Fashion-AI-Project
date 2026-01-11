<<<<<<< HEAD
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      setError(err.message);
=======
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
>>>>>>> 3941287c082c467290b46966966e7b8dc0f50a45
    }
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleReset}>
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your registered email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <button type="submit">Reset Password</button>

      {message && <p style={{ color: "green" }}>{message}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
=======
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
>>>>>>> 3941287c082c467290b46966966e7b8dc0f50a45
  );
};

export default ForgotPassword;
