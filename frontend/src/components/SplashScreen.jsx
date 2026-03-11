import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuth } from "./Appcontext";
import '../styles/SplashScreen.css';
import logo from "../assets/logo.png";   // adjust path if needed

const SplashScreen = () => {
  const { currentUser, loading } = useAuth();
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);

  // ✅ Minimum splash screen display time (1.5 seconds)
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 4000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ Redirect immediately when auth state is known
  React.useEffect(() => {
    if (!loading) {
      if (currentUser) {
        navigate("/home");
      } else {
        navigate("/login");
      }
    }
  }, [currentUser, loading, showSplash, navigate]);

  if (showSplash) {
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
              animationDelay: `${Math.random() * 4}s`,
            }}
          />
        ))}
      </div>
    );
  }
  
  return null;
};

export default SplashScreen;