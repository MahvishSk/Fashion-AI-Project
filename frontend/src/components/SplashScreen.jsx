import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/SplashScreen.css';  // Updated CSS

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/welcome');  // Auto-redirect after 3 seconds
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="splash-page">
      <div className="splash-header">
        <div className="logo">👗</div>  {/* Replace with your logo image */}
        <h1 className="app-name">Style U</h1>
        <p className="tagline">Your Personal AI Fashion Assistant</p>
      </div>
      <div className="splash-spinner"></div>
    </div>
  );
};

export default SplashScreen;