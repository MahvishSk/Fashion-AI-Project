import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Popup.css'; // Import the CSS

const Popup = ({ isMenuOpen, setIsMenuOpen, isProfileOpen, setIsProfileOpen }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("User"); // Load from localStorage

   useEffect(() => {
      const storedName = localStorage.getItem("username");
      if (storedName) {
        setUsername(storedName);
      }
    }, []);

  // Default grey placeholder (circular user icon)
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iNDUiIGZpbGw9IiNjY2MiLz4KPHBhdGggZD0iTTQ1IDIwQzM3LjI3IDE5Ljc1IDMwLjI1QzM3LjI3IDMwLjI1IDMwLjI1IDMwLjI1IDMwLjI1IDM3LjI1QzMwLjI1IDM3LjI1IDMwLjI1IDQ1IDMwLjI1IDQ1QzMwLjI1IDQ1IDMwLjI1IDUyLjUgMzAuMjUgNTIuNUMzMC4yNSA1Mi41IDMwLjI1IDYwIDMwLjI1IDYwQzMwLjI1IDYwIDM3LjI1IDYwIDM3LjI1IDYwQzM3LjI1IDYwIDQ1IDYwIDQ1IDYwQzQ1IDYwIDUyLjUgNjAgNTIuNSA2MEM1Mi41IDYwIDUyLjUgNTIuNSA1Mi41IDUyLjVDNTIuNSA1Mi41IDUyLjUgNDUgNTIuNSA0NUM1Mi41IDQ1IDUyLjUgMzcuMjUgNTIuNSAzNy4yNUM1Mi41IDM3LjI1IDQ1IDM3LjI1IDQ1IDIwWiIgZmlsbD0iIzk5OSI+PC9wYXRoPgo8L3N2Zz4=';
   const [profileImage, setProfileImage] = useState(localStorage.getItem('profileImage') || defaultPlaceholder); // Load from localStorage
 
  
  // Menu items with icons, labels, and paths
  const menuItems = [
    { icon: '🏠', label: 'Home', path: '/home', key: 'home' },
    { icon: '👤', label: 'Profile', path: '/profile', key: 'profile' },
    { icon: '🤖', label: 'AI Stylist', path: '/chatbot', key: 'chatbot' },
    { icon: '📈', label: 'Trending Fashion', path: '/trending', key: 'trending' },
    { icon: '💾', label: 'Saved Looks', path: '/saved', key: 'saved' },
    { icon: '🔍', label: 'Explore Styles', path: '/category/all', key: 'explore' },
    { icon: '⚙️', label: 'Settings', path: '/settings', key: 'settings' },
  ];

  // Determine active item based on current path
  const getActiveItem = () => {
    const currentPath = window.location.pathname;
    const item = menuItems.find(item => item.path === currentPath);
    return item ? item.key : null;
  };
  const activeItem = getActiveItem();

  // Handle navigation
  const handleNavigate = (path) => {
    navigate(path);
    setIsMenuOpen(false);
    setIsProfileOpen(false);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/welcome');
    setIsMenuOpen(false);
  };

  // Handle file selection for profile image
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
         const imageData = reader.result;
        setProfileImage(imageData); // Update state
        localStorage.setItem('profileImage', imageData); // Persist in localStorage
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Trigger file input on camera icon click
  const triggerFileInput = () => {
    document.getElementById('profile-file-input').click();
  };

  // Remove photo and reset to default
  const removePhoto = () => {
    setProfileImage(defaultPlaceholder);
  };

  // Close on outside click
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsMenuOpen(false);
      setIsProfileOpen(false);
    }
  };

  return (
    <>
      {/* Hidden file input for image upload */}
      <input
        type="file"
        id="profile-file-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

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
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </li>
            ))}
            <li className="menu-item logout" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span className="menu-label">Logout</span>
            </li>
          </ul>
        </div>
      )}

      {/* Right Profile Mini Popup */}
      {isProfileOpen && (
        <div className="popup-profile">
          <div className="profile-p-card">
            <h3 className="profile-p-title">Profile</h3>
            <div className="profile-p-photo-container">
              <img src={profileImage} alt="Profile" className="profile-p-photo" />
              <div className="camera-p-icon" onClick={triggerFileInput}>📷</div>
              <div className="remove-p-icon" onClick={removePhoto}>❌</div>
            </div>
           <p className="username-p">{username}</p> {/* Displays username */}
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