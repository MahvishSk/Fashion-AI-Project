import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import '../styles/Welcome.css';
import logo from "../assets/logo1.png";

const Welcome = ({ onLoginSuccess }) => {
const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="welcome-container">
      <div className="header-wlc">
        <img src={logo} alt="StyleU Logo" className="welcome-logo" />
        <h2 className="main-heading">Welcome to StyleU</h2>
        <p className="sub-text">Your Personal AI Fashion Stylist</p>
      </div>

      <div className="card">
        <div className="toggle-tabs">

          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}>
            Sign Up
          </button>

          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}>
            Login
          </button>

          {/* ⚠️ Slider logic unchanged */}
          <div className={`slider ${isLogin ? 'login' : 'signup'}`}></div>
        </div>

        <h3 className="card-title">
          {isLogin ? 'Create Your Account' : 'Welcome Back'}
        </h3>

        {/* COMPONENTS */}
        {isLogin ? <Signup onLoginSuccess={onLoginSuccess} /> : <Login onLoginSuccess={onLoginSuccess} />}
      </div>
    </div>
  );
};
export default Welcome;