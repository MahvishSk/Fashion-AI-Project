import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Sun, Moon, Bell, Star, MessageSquare,
  HelpCircle, Phone, Trash2, LogOut, ChevronRight, X
} from 'lucide-react';
import Header from './Header';
import Popup from './Popup';
import { useApp } from './Appcontext';
import '../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useApp();

  // Popup state
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dropdown open/close
  const [personalDetailsOpen, setPersonalDetailsOpen] = useState(false);
  const [ratingsOpen, setRatingsOpen] = useState(false);

  // NOTIFICATIONS STATE
  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('notifications');
    return saved !== null ? JSON.parse(saved) : true;
  });

  // Modal states
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Feedback form
  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Rating selection
  const [selectedRating, setSelectedRating] = useState(0);

  // User info
  const username = localStorage.getItem('username') || 'User';
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iNDUiIGZpbGw9IiNjY2MiLz4KPC9zdmc+';
  const profileImage = localStorage.getItem('profileImage') || defaultPlaceholder;

  // ── Handlers ──
  
  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const handleNotificationToggle = () => {
    const newValue = !notifications;
    setNotifications(newValue);
    localStorage.setItem('notifications', JSON.stringify(newValue));
    alert(newValue ? 'Notifications enabled!' : 'Notifications disabled!');
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setRatingsOpen(false);
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    alert(`Feedback Submitted!\nRating: ${feedbackRating} ⭐\nMessage: ${feedbackMessage}`);
    setFeedbackModalOpen(false);
    setFeedbackRating(0);
    setFeedbackMessage('');
  };

  const handleDeleteAccount = () => {
    localStorage.clear();
    navigate('/welcome');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/welcome');
  };

  // Star renderer helper
  const renderStars = (count, size = 14) =>
    [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={star <= count ? 'star-filled' : 'star-empty'}
        fill={star <= count ? '#E88BA3' : 'none'}
        onClick={() => {}}
      />
    ));

  return (
    <div className={`settings-page theme-${theme}`}>
      <Header
        isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen}
      />

      <h1 className="settings-page-title">Settings</h1>

      <div className="settings-container">

        {/* General */}
        <div className="settings-section">
          <h2 className="section-title">General</h2>
          <div className="settings-card">
            <div className="settings-row clickable" onClick={() => setPersonalDetailsOpen(!personalDetailsOpen)}>
              <div className="row-left">
                <User className="row-icon" size={20} />
                <span>Personal Details</span>
              </div>
              <ChevronRight className={`row-arrow ${personalDetailsOpen ? 'open' : ''}`} size={20} />
            </div>
            {personalDetailsOpen && (
              <div className="dropdown-content">
                <div className="personal-details-box">
                  <img src={profileImage} alt="Profile" className="dropdown-profile-photo" />
                  <span className="dropdown-username">{username}</span>
                  <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
                    Edit Profile
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Preferences */}
        <div className="settings-section">
          <h2 className="section-title">Preferences</h2>
          <div className="settings-card">

            {/* Theme Toggle */}
            <div className="settings-row">
              <div className="row-left">
                {theme === 'light'
                  ? <Sun className="row-icon" size={20} />
                  : <Moon className="row-icon" size={20} />}
                <span>Theme</span>
              </div>
              <div className="toggle-switch-container">
                <span className={theme === 'light' ? 'active' : ''}>Light</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={handleThemeToggle}
                  />
                  <span className="toggle-slider" />
                </label>
                <span className={theme === 'dark' ? 'active' : ''}>Dark</span>
              </div>
            </div>

            {/* Notifications Toggle */}
            <div className="settings-row">
              <div className="row-left">
                <Bell className="row-icon" size={20} />
                <span>Notifications</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={handleNotificationToggle}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Ratings */}
            <div className="settings-row clickable" onClick={() => setRatingsOpen(!ratingsOpen)}>
              <div className="row-left">
                <Star className="row-icon" size={20} />
                <span>Ratings</span>
              </div>
              <div className="row-right">
                <div className="current-rating">{renderStars(selectedRating, 14)}</div>
                <ChevronRight className={`row-arrow ${ratingsOpen ? 'open' : ''}`} size={20} />
              </div>
            </div>
            {ratingsOpen && (
              <div className="dropdown-content ratings-dropdown">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div 
                    key={rating} 
                    className="dropdown-item rating-item" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRatingSelect(rating);
                    }}
                  >
                    {renderStars(rating, 16)}
                    <span>{rating} {rating === 1 ? 'Star' : 'Stars'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Feedback */}
            <div className="settings-row clickable" onClick={() => setFeedbackModalOpen(true)}>
              <div className="row-left">
                <MessageSquare className="row-icon" size={20} />
                <span>Feedback</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>

          </div>
        </div>

        {/* Support */}
        <div className="settings-section">
          <h2 className="section-title">Support</h2>
          <div className="settings-card">
            <div className="settings-row clickable" onClick={() => navigate('/help')}>
              <div className="row-left">
                <HelpCircle className="row-icon" size={20} />
                <span>Help Center</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
            <div className="settings-row clickable" onClick={() => navigate('/contact')}>
              <div className="row-left">
                <Phone className="row-icon" size={20} />
                <span>Contact Us</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="settings-section">
          <h2 className="section-title">Account</h2>
          <div className="settings-card">
            <div className="settings-row clickable danger" onClick={() => setDeleteModalOpen(true)}>
              <div className="row-left">
                <Trash2 className="row-icon" size={20} />
                <span>Delete Account</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
            <div className="settings-row clickable danger" onClick={() => setLogoutModalOpen(true)}>
              <div className="row-left">
                <LogOut className="row-icon" size={20} />
                <span>Logout</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
          </div>
        </div>

      </div>

      <Popup
        isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen}
      />

      {/* Feedback Modal */}
      <div className={`modal-overlay ${feedbackModalOpen ? 'show' : 'hidden'}`} onClick={() => setFeedbackModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Feedback</h3>
            <X className="close-icon" size={20} onClick={() => setFeedbackModalOpen(false)} />
          </div>
          <form className="modal-body" onSubmit={handleFeedbackSubmit}>
            <div className="rating-input">
              <p>Rate us:</p>
              <div className="stars-container">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star} size={30}
                    className={star <= feedbackRating ? 'star-filled' : 'star-empty'}
                    fill={star <= feedbackRating ? '#E88BA3' : 'none'}
                    onClick={() => setFeedbackRating(star)}
                    style={{ cursor: 'pointer' }}
                  />
                ))}
              </div>
            </div>
            <div className="feedback-textarea">
              <p>Your Message:</p>
              <textarea
                value={feedbackMessage}
                onChange={(e) => setFeedbackMessage(e.target.value)}
                placeholder="Write your feedback here..."
                rows="4"
              />
            </div>
            <div className="modal-footer">
              <button type="button" className="cancel-modal-btn" onClick={() => setFeedbackModalOpen(false)}>Cancel</button>
              <button type="submit" className="submit-modal-btn">Submit</button>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Modal */}
      <div className={`modal-overlay ${deleteModalOpen ? 'show' : 'hidden'}`} onClick={() => setDeleteModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Delete Account</h3>
            <X className="close-icon" size={20} onClick={() => setDeleteModalOpen(false)} />
          </div>
          <div className="modal-body">
            <p>Are you sure you want to delete your account?</p>
          </div>
          <div className="modal-footer">
            <button className="cancel-modal-btn" onClick={() => setDeleteModalOpen(false)}>No</button>
            <button className="danger-modal-btn" onClick={handleDeleteAccount}>Yes</button>
          </div>
        </div>
      </div>

      {/* Logout Modal */}
      <div className={`modal-overlay ${logoutModalOpen ? 'show' : 'hidden'}`} onClick={() => setLogoutModalOpen(false)}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>Logout</h3>
            <X className="close-icon" size={20} onClick={() => setLogoutModalOpen(false)} />
          </div>
          <div className="modal-body">
            <p>Are you sure you want to logout?</p>
          </div>
          <div className="modal-footer">
            <button className="cancel-modal-btn" onClick={() => setLogoutModalOpen(false)}>No</button>
            <button className="submit-modal-btn" onClick={handleLogout}>Yes</button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Settings;