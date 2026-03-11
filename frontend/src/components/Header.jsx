import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // ADD THIS
import logo from "../assets/logo1.png";
import '../styles//Header.css';

const Header = ({ isMenuOpen, setIsMenuOpen, isProfileOpen, setIsProfileOpen }) => {
  const navigate = useNavigate(); // ADD THIS
  
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
    window.addEventListener('userLoggedOut', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('userLoggedIn', checkLoginStatus);
      window.removeEventListener('userLoggedOut', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleLoginClick = () => {
    navigate('/welcome'); // CHANGE THIS - use navigate instead of window.location
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