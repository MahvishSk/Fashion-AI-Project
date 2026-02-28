import React, { useState, useEffect } from 'react';
import PromoPopup from './PromoPopup';

const ProtectedRoute = ({ children, allowGuest = false }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkLogin = () => {
      const loggedIn = localStorage.getItem("token") && localStorage.getItem("username");
      setIsLoggedIn(loggedIn);
      if (!loggedIn) {
        setShowPopup(true); // Show popup immediately if not logged in
      }
    };
    checkLogin();

    // Listen for login event
    const handleLogin = () => {
      setIsLoggedIn(true);
      setShowPopup(false);
    };
    window.addEventListener('userLoggedIn', handleLogin);
    
    return () => window.removeEventListener('userLoggedIn', handleLogin);
  }, []);

  // If logged in, show the actual content
  if (isLoggedIn) {
    return children;
  }

  // If guest is allowed (chatbot), show content + popup
  if (allowGuest) {
    return (
      <>
        {children}
        {showPopup && <PromoPopup forceShow={true} onClose={() => setShowPopup(false)} />}
      </>
    );
  }

  // Not logged in - show popup on current page (no redirect)
  return (
    <>
      {/* Show a blurred/grayed out background or empty state */}
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'rgba(251, 231, 229, 0.5)' // Your theme background with opacity
      }}>
        <div style={{ textAlign: 'center', color: '#B7688A' }}>
          <h2>🔒 Login Required</h2>
          <p>Please login to view this page</p>
        </div>
      </div>
      
      {/* Show the popup immediately */}
      {showPopup && (
        <PromoPopup 
          forceShow={true} 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </>
  );
};

export default ProtectedRoute;