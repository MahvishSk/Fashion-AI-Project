import React from 'react';
import logo from "../assets/logo1.png"; // Import your logo
import '../styles//Header.css'; // Import the CSS

const Header = ({ isMenuOpen, setIsMenuOpen, isProfileOpen, setIsProfileOpen }) => {
  return (
    <header className="app-bar">
      {/* Hamburger Menu */}
      <div className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</div>
      
      {/* Logo Container */}
      <div className="logo-H-container">
        <img src={logo} alt="StyleU Logo" className="logo-H" />
        <span className="logo-H-text">StyleU</span>
      </div>
      
      {/* Profile Icon */}
      <div className="profile-icon" onClick={() => setIsProfileOpen(true)}>👤</div>
    </header>
  );
};

export default Header;