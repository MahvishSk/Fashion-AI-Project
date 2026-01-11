<<<<<<< HEAD
import { useState } from "react";
import { Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      console.log("Logged in UID:", userCredential.user.uid);
      alert("Login successful!");
    } catch (err) {
      setError(err.message);
=======
import React, { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import ForgotPassword from './ForgotPassword';
import '../styles/Login.css';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [showForgot, setShowForgot] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, formData.email, formData.password);
      setShowPopup(true);
      setTimeout(() => {
        setShowPopup(false);
        navigate('/home');
      }, 1000);
    } catch (err) {
      setError('Invalid credentials');
>>>>>>> 3941287c082c467290b46966966e7b8dc0f50a45
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
<<<<<<< HEAD
    <form onSubmit={handleLogin}>
      <h2>Login</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit">Login</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <p style={{ marginTop: "10px" }}>
        Don’t have an account? <Link to="/signup">Sign up</Link>
      </p>

      <p>
        <Link to="/forgot-password">Forgot Password?</Link>
      </p>
    </form>
=======
    <div>
      <form onSubmit={handleSubmit} className="login-form">
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field password-input"
            required
          />
          <span
            className="eye-icon"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <button type="submit" className="submit-btn">Login</button>
        {error && <p className="error">{error}</p>}
      </form>
      <p className="forgot-link">
        <a href="#" onClick={() => setShowForgot(true)}>Forgot Password?</a>
      </p>
      {showForgot && <ForgotPassword onClose={() => setShowForgot(false)} />}
      {showPopup && (
        <div className="popup">
          <div className="popup-content">
            <div className="tick">✓</div>
            <p>Login Successful</p>
          </div>
        </div>
      )}
    </div>
>>>>>>> 3941287c082c467290b46966966e7b8dc0f50a45
  );
};

export default Login;
