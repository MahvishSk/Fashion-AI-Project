import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, Bot, TrendingUp, Bookmark, Search, Settings, LogOut } from 'lucide-react';
import '../styles/Popup.css';

const Popup = ({ isMenuOpen, setIsMenuOpen, isProfileOpen, setIsProfileOpen }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const storedName = localStorage.getItem("username");
    if (storedName) {
      setUsername(storedName);
    }
  }, []);

  // Default grey placeholder
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iNDUiIGZpbGw9IiNjY2MiLz4KPHBhdGggZD0iTTQ1IDIwQzM3LjI3IDE5Ljc1IDMwLjI1QzM3LjI3IDMwLjI1IDMwLjI1IDMwLjI1IDMwLjI1IDM3LjI1QzMwLjI1IDM3LjI1IDMwLjI1IDQ1IDMwLjI1IDQ1QzMwLjI1IDQ1IDMwLjI1IDUyLjUgMzAuMjUgNTIuNUMzMC4yNSA1Mi41IDMwLjI1IDYwIDMwLjI1IDYwQzMwLjI1IDYwIDM3LjI1IDYwIDM3LjI1IDYwQzM3LjI1IDYwIDQ1IDYwIDQ1IDYwQzQ1IDYwIDUyLjUgNjAgNTIuNSA2MEM1Mi41IDYwIDUyLjUgNTIuNSA1Mi41IDUyLjVDNTIuNSA1Mi41IDUyLjUgNDUgNTIuNSA0NUM1Mi41IDQ1IDUyLjUgMzcuMjUgNTIuNSAzNy4yNUM1Mi41IDM3LjI1IDQ1IDM3LjI1IDQ1IDIwWiIgZmlsbD0iIzk5OSI+PC9wYXRoPgo8L3N2Zz4=';
  
  const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || defaultPlaceholder);

  useEffect(() => {
    const handleStorageChange = () => {
      const updatedImage = localStorage.getItem('profileImage') || defaultPlaceholder;
      setProfileImage(updatedImage);
    };
     // Listen for both storage changes (other tabs) and custom event (same tab)
  window.addEventListener('storage', handleStorageChange);
  window.addEventListener('profileImageUpdated', handleStorageChange);
  
  return () => {
    window.removeEventListener('storage', handleStorageChange);
    window.removeEventListener('profileImageUpdated', handleStorageChange);
  };
}, []);

  const menuItems = [
    { icon: Home, label: 'Home', path: '/home', key: 'home' },
    { icon: User, label: 'Profile', path: '/profile', key: 'profile' },
    { icon: Bot, label: 'AI Stylist', path: '/chatbot', key: 'chatbot' },
    { icon: TrendingUp, label: 'Trending Fashion', path: '/trending', key: 'trending' },
    { icon: Bookmark, label: 'Saved Looks', path: '/saved', key: 'saved' },
    { icon: Search, label: 'Explore Styles', path: '/category/all', key: 'explore' },
    { icon: Settings, label: 'Settings', path: '/settings', key: 'settings' },
  ];

  const getActiveItem = () => {
    const currentPath = window.location.pathname;
    const item = menuItems.find(item => item.path === currentPath);
    return item ? item.key : null;
  };
  const activeItem = getActiveItem();

  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('username');
    localStorage.removeItem('profileImage');
    navigate('/welcome');
    setIsMenuOpen(false);
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    }
  };

  return (
    <>
      {/* Overlay for outside click */}
      {(isMenuOpen || isProfileOpen) && (
        <div className="popup-overlay" onClick={handleOverlayClick}></div>
      )}

      {/* Left Sliding Menu */}
      {isMenuOpen && (
        <div className="popup-menu">
          <div className="menu-header">
            <h2>StyleU Menu</h2>
          </div>
          <ul className="menu-list">
            {menuItems.map((item, index) => (
              <li
                key={index}
                className={`menu-item ${activeItem === item.key ? "active" : ""}`}
                onClick={() => handleNavigate(item.path)}
              >
                <item.icon className="menu-icon" size={20} />
                <span className="menu-label">{item.label}</span>
              </li>
            ))}
            <li className="menu-item logout" onClick={handleLogout}>
              <LogOut className="menu-icon" size={20} />
              <span className="menu-label">Logout</span>
            </li>
          </ul>
        </div>
      )}

      {/* Right Profile Mini Popup - UPDATED */}
      {isProfileOpen && (
        <div className="popup-profile">
          <div className="profile-p-card">
            <h3 className="profile-p-title">Profile</h3>
            
            {/* Just Profile Photo - No Edit Icons */}
            <div className="profile-p-photo-container">
              <img src={profileImage} alt="Profile" className="profile-p-photo" />
            </div>
            
            <p className="username-p">{username}</p>
            <button className="view-more-p-btn" onClick={() => handleNavigate('/profile')}>
              View More
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;