import React, { useState } from 'react';
import Login from './Login';
import Signup from './Signup';
import '../styles/Welcome.css';
import logo from "../assets/logo1.png";   // adjust path if needed

const Welcome = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="welcome-container">
      <div className="header">
        <img src={logo} alt="StyleU Logo" className="welcome-logo" />
        <h2 className="main-heading">Welcome to StyleU</h2>
        <p className="sub-text">Your Personal AI Fashion Assistant</p>
      </div>
      <div className="card">
        <div className="toggle-tabs">
          <button
            className={`tab ${isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={`tab ${!isLogin ? 'active' : ''}`}
            onClick={() => setIsLogin(false)}
          >
            Sign Up
          </button>
          <div className={`slider ${isLogin ? 'login' : 'signup'}`}></div>
        </div>
        <h3 className="card-title">{isLogin ? 'Welcome Back' : 'Create Your Account'}</h3>
        {isLogin ? <Login /> : <Signup />}
      </div>
    </div>
  );
};

export default Welcome;