import React from 'react';
import '../styles/SplashScreen.css';
import logo from "../assets/logo.png";   // adjust path if needed

const SplashScreen = () => {
  return (
    <div className="splash-screen">
      <div className="logo-container">
        <img src={logo} alt="StyleU Logo" className="logo" />
      </div>
      {[...Array(30)].map((_, i) => (
        <div
          key={i}
          className="particle"
          style={{
            left: `${Math.random() * 100}%`,
            right: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            down: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 5}s`,
          }}
        />
      ))}
    </div>
  );
};

export default SplashScreen;