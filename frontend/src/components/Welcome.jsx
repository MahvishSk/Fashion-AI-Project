import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Welcome.css';  // Updated CSS

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-page">
      <div className="welcome-content">
        <div className="logo">👗</div>  {/* Fashion icon; replace with image if needed */}
        <h1 className="app-name">Welcome To Style U !</h1>
        <h2 className="tagline">Your Personal AI Fashion Assistant</h2>
        <div className="welcome-buttons">
          <button className="btn btn-primary" onClick={() => navigate('/login')}>
            Login
          </button>
          <button className="btn btn-success" onClick={() => navigate('/signup')}>
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Welcome;