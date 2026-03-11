import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/PromoPopup.css';

const PromoPopup = ({ forceShow = false, allowGuest = false, onClose }) => {
  const [isVisible, setIsVisible] = useState(forceShow); // Show immediately if forceShow
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const checkLoginStatus = () => {
    const loggedIn = localStorage.getItem("token") && localStorage.getItem("username");
    setIsLoggedIn(loggedIn);
    if (loggedIn) {
      setIsVisible(false);
      sessionStorage.setItem("promoPopupDismissed", "true");
    }
    return loggedIn;
  };

  useEffect(() => {
    const loggedIn = checkLoginStatus();
    const hasDismissed = sessionStorage.getItem("promoPopupDismissed");

    // If forceShow is true, show immediately (don't wait 10s)
    if (forceShow) {
      if (!loggedIn) {
        setIsVisible(true);
      }
      return;
    }

    // Normal flow: show after 10 seconds on home page
    if (!loggedIn && !hasDismissed && location.pathname === '/home') {
      const timer = setTimeout(() => {
        if (!checkLoginStatus()) {
          setIsVisible(true);
        }
      }, 10000);
      return () => clearTimeout(timer);
    }

    window.addEventListener('userLoggedIn', checkLoginStatus);
    window.addEventListener('storage', checkLoginStatus);

    return () => {
      window.removeEventListener('userLoggedIn', checkLoginStatus);
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, [forceShow, location.pathname]);

  const handleLogin = () => {
    sessionStorage.setItem("promoPopupDismissed", "true");
    setIsVisible(false);
    if (onClose) onClose(); // Call onClose if provided
    navigate('/welcome');
  };

  const handleCancel = () => {
    sessionStorage.setItem("promoPopupDismissed", "true");
    setIsVisible(false);
    if (onClose) onClose(); // Call onClose if provided
    
    // If on protected page (not home, not chatbot), go to home
    if (location.pathname !== '/home' && location.pathname !== '/chatbot') {
      navigate('/home');
    }
  };

  if (isLoggedIn || !isVisible) return null;

  return (
    <div className="promo-popup-overlay" onClick={handleCancel}>
      <div className="promo-popup-container" onClick={(e) => e.stopPropagation()}>
        <div className="promo-popup-content">
          <h2 className="promo-popup-title">
            {forceShow ? "🔒 Login Required" : "Welcome to StyleU! ✨"}
          </h2>
          <p className="promo-popup-message">
            {forceShow 
              ? "Please login to access this page!."
              : "Login now for a personalized fashion experience! Unlock exclusive features tailored just for you."
            }
          </p>
          <div className="promo-popup-buttons">
            <button className="promo-popup-btn promo-popup-cancel" onClick={handleCancel}>
              Cancel
            </button>
            <button className="promo-popup-btn promo-popup-login" onClick={handleLogin}>
              Signup/Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoPopup;