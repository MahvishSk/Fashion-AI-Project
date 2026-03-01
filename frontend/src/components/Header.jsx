import React, { useState, useEffect } from 'react';
import logo from "../assets/logo1.png";
import '../styles//Header.css';

const Header = ({ isMenuOpen, setIsMenuOpen, isProfileOpen, setIsProfileOpen }) => {
  // Check for BOTH token AND username
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return !!(localStorage.getItem("token") && localStorage.getItem("username"));
  });

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedIn = !!(localStorage.getItem("token") && localStorage.getItem("username"));
      setIsLoggedIn(loggedIn);
    };

    checkLoginStatus();
    window.addEventListener('userLoggedIn', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('userLoggedIn', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLoginClick = () => {
    window.location.href = '/welcome';
  };

  return (
    <header className="app-bar">
      <div className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</div>
      
      <div className="logo-H-container">
        <img src={logo} alt="StyleU Logo" className="logo-H" />
        <span className="logo-H-text">StyleU</span>
      </div>
      
      <div className="header-right-section">
        {!isLoggedIn && (
          <button className="login-header-btn" onClick={handleLoginClick}>
            Login
          </button>
        )}
        <div className="profile-icon" onClick={() => setIsProfileOpen(true)}>👤</div>
      </div>
    </header>
  );
};

export default Header;