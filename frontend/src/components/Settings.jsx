import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User, Globe, Sun, Moon, Bell, Star, MessageSquare,
  HelpCircle, Phone, Trash2, LogOut, ChevronRight, X
} from 'lucide-react';
import Header from './Header';
import Popup from './Popup';
import { useApp } from './Appcontext';
import '../styles/Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  const { theme, setTheme, language, setLanguage, t } = useApp();
  const s = t.settings; // shortcut for settings translations

  // Popup state
  const [isMenuOpen,    setIsMenuOpen]    = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Dropdown open/close
  const [personalDetailsOpen, setPersonalDetailsOpen] = useState(false);
  const [languageOpen,        setLanguageOpen]        = useState(false);
  const [ratingsOpen,         setRatingsOpen]         = useState(false);

  // Toggle states
  const [notifications, setNotifications] = useState(true);

  // Modal states
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [deleteModalOpen,   setDeleteModalOpen]   = useState(false);
  const [logoutModalOpen,   setLogoutModalOpen]   = useState(false);

  // Feedback form
  const [feedbackRating,  setFeedbackRating]  = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Rating selection in settings row
  const [selectedRating, setSelectedRating] = useState(0);

  // User info
  const username = localStorage.getItem('username') || 'User';
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iNDUiIGZpbGw9IiNjY2MiLz4KPC9zdmc+';
  const profileImage = localStorage.getItem('profileImage') || defaultPlaceholder;

  const languages = ['English', 'Hindi'];

  // ── Handlers ──
  const handleLanguageSelect = (lang) => {
    setLanguage(lang);   // updates global context → all pages re-render
    setLanguageOpen(false);
  };

  const handleThemeToggle = () => {
    setTheme(theme === 'light' ? 'dark' : 'light'); // updates global context + body class
  };

  const handleRatingSelect = (rating) => {
    setSelectedRating(rating);
    setRatingsOpen(false);
  };

  const handleFeedbackSubmit = () => {
    alert(`${s.feedbackTitle}!\nRating: ${feedbackRating} ⭐\nMessage: ${feedbackMessage}`);
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

  // ── Star renderer helper ──
  const renderStars = (count, size = 14) =>
    [1, 2, 3, 4, 5].map((star) => (
      <Star
        key={star}
        size={size}
        className={star <= count ? 'star-filled' : 'star-empty'}
        fill={star <= count ? '#E88BA3' : 'none'}
      />
    ));

  // ── Reusable Modal ──
  const Modal = ({ open, onClose, title, children, footer }) =>
    open ? (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="modal-header">
            <h3>{title}</h3>
            <X className="close-icon" size={20} onClick={onClose} />
          </div>
          <div className="modal-body">{children}</div>
          <div className="modal-footer">{footer}</div>
        </div>
      </div>
    ) : null;

  return (
    <div className={`settings-page theme-${theme}`}>
      <Header
        isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen} setIsProfileOpen={setIsProfileOpen}
      />

      <h1 className="settings-page-title">{s.title}</h1>

      <div className="settings-container">

        {/* ── General ── */}
        <div className="settings-section">
          <h2 className="section-title">{s.general}</h2>
          <div className="settings-card">
            {/* Personal Details */}
            <div className="settings-row clickable" onClick={() => setPersonalDetailsOpen(!personalDetailsOpen)}>
              <div className="row-left">
                <User className="row-icon" size={20} />
                <span>{s.personalDetails}</span>
              </div>
              <ChevronRight className={`row-arrow ${personalDetailsOpen ? 'open' : ''}`} size={20} />
            </div>
            {personalDetailsOpen && (
              <div className="dropdown-content">
                <div className="personal-details-box">
                  <img src={profileImage} alt="Profile" className="dropdown-profile-photo" />
                  <span className="dropdown-username">{username}</span>
                  <button className="edit-profile-btn" onClick={() => navigate('/profile')}>
                    {s.editProfile}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Preferences ── */}
        <div className="settings-section">
          <h2 className="section-title">{s.preferences}</h2>
          <div className="settings-card">

            {/* Language */}
            <div className="settings-row clickable" onClick={() => setLanguageOpen(!languageOpen)}>
              <div className="row-left">
                <Globe className="row-icon" size={20} />
                <span>{s.language}</span>
              </div>
              <div className="row-right">
                <span className="selected-value">{language}</span>
                <ChevronRight className={`row-arrow ${languageOpen ? 'open' : ''}`} size={20} />
              </div>
            </div>
            {languageOpen && (
              <div className="dropdown-content">
                {languages.map((lang) => (
                  <div
                    key={lang}
                    className={`dropdown-item ${language === lang ? 'active' : ''}`}
                    onClick={() => handleLanguageSelect(lang)}
                  >
                    {lang}
                  </div>
                ))}
              </div>
            )}

            {/* Theme Toggle */}
            <div className="settings-row">
              <div className="row-left">
                {theme === 'light'
                  ? <Sun className="row-icon" size={20} />
                  : <Moon className="row-icon" size={20} />}
                <span>{s.theme}</span>
              </div>
              <div className="toggle-switch-container">
                <span className={theme === 'light' ? 'active' : ''}>{s.themeLight}</span>
                <label className="toggle-switch">
                  <input
                    type="checkbox"
                    checked={theme === 'dark'}
                    onChange={handleThemeToggle}
                  />
                  <span className="toggle-slider" />
                </label>
                <span className={theme === 'dark' ? 'active' : ''}>{s.themeDark}</span>
              </div>
            </div>

            {/* Notifications */}
            <div className="settings-row">
              <div className="row-left">
                <Bell className="row-icon" size={20} />
                <span>{s.notifications}</span>
              </div>
              <label className="toggle-switch">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={() => setNotifications(!notifications)}
                />
                <span className="toggle-slider" />
              </label>
            </div>

            {/* Ratings */}
            <div className="settings-row clickable" onClick={() => setRatingsOpen(!ratingsOpen)}>
              <div className="row-left">
                <Star className="row-icon" size={20} />
                <span>{s.ratings}</span>
              </div>
              <div className="row-right">
                <div className="current-rating">{renderStars(selectedRating, 14)}</div>
                <ChevronRight className={`row-arrow ${ratingsOpen ? 'open' : ''}`} size={20} />
              </div>
            </div>
            {ratingsOpen && (
              <div className="dropdown-content ratings-dropdown">
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="dropdown-item rating-item" onClick={() => handleRatingSelect(rating)}>
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
                <span>{s.feedback}</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>

          </div>
        </div>

        {/* ── Support ── */}
        <div className="settings-section">
          <h2 className="section-title">{s.support}</h2>
          <div className="settings-card">
            <div className="settings-row clickable">
              <div className="row-left">
                <HelpCircle className="row-icon" size={20} />
                <span>{s.helpCenter}</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
            <div className="settings-row clickable">
              <div className="row-left">
                <Phone className="row-icon" size={20} />
                <span>{s.contactUs}</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
          </div>
        </div>

        {/* ── Account ── */}
        <div className="settings-section">
          <h2 className="section-title">{s.account}</h2>
          <div className="settings-card">
            <div className="settings-row clickable danger" onClick={() => setDeleteModalOpen(true)}>
              <div className="row-left">
                <Trash2 className="row-icon" size={20} />
                <span>{s.deleteAccount}</span>
              </div>
              <ChevronRight className="row-arrow" size={20} />
            </div>
            <div className="settings-row clickable danger" onClick={() => setLogoutModalOpen(true)}>
              <div className="row-left">
                <LogOut className="row-icon" size={20} />
                <span>{s.logout}</span>
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

      {/* ── Feedback Modal ── */}
      <Modal
        open={feedbackModalOpen}
        onClose={() => setFeedbackModalOpen(false)}
        title={s.feedbackTitle}
        footer={
          <>
            <button className="cancel-modal-btn" onClick={() => setFeedbackModalOpen(false)}>{s.cancel}</button>
            <button className="submit-modal-btn" onClick={handleFeedbackSubmit}>{s.submit}</button>
          </>
        }
      >
        <div className="rating-input">
          <p>{s.feedbackRate}</p>
          <div className="stars-container">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star} size={30}
                className={star <= feedbackRating ? 'star-filled' : 'star-empty'}
                fill={star <= feedbackRating ? '#E88BA3' : 'none'}
                onClick={() => setFeedbackRating(star)}
              />
            ))}
          </div>
        </div>
        <div className="feedback-textarea">
          <p>{s.feedbackMessage}</p>
          <textarea
            value={feedbackMessage}
            onChange={(e) => setFeedbackMessage(e.target.value)}
            placeholder={s.feedbackPlaceholder}
            rows="4"
          />
        </div>
      </Modal>

      {/* ── Delete Modal ── */}
      <Modal
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        title={s.deleteTitle}
        footer={
          <>
            <button className="cancel-modal-btn" onClick={() => setDeleteModalOpen(false)}>{s.no}</button>
            <button className="danger-modal-btn"  onClick={handleDeleteAccount}>{s.yes}</button>
          </>
        }
      >
        <p>{s.deleteConfirm}</p>
      </Modal>

      {/* ── Logout Modal ── */}
      <Modal
        open={logoutModalOpen}
        onClose={() => setLogoutModalOpen(false)}
        title={s.logoutTitle}
        footer={
          <>
            <button className="cancel-modal-btn" onClick={() => setLogoutModalOpen(false)}>{s.no}</button>
            <button className="submit-modal-btn"  onClick={handleLogout}>{s.yes}</button>
          </>
        }
      >
        <p>{s.logoutConfirm}</p>
      </Modal>

    </div>
  );
};

export default Settings;