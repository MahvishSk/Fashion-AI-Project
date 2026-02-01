import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { reauthenticateWithCredential, EmailAuthProvider, updatePassword } from 'firebase/auth';
import logo from "../assets/logo1.png";
import Popup from './Popup';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false); // New state for popup
  const [profileImage, setProfileImage] = useState('');
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [passwordErrors, setPasswordErrors] = useState({});

  // Default grey placeholder
  const defaultPlaceholder = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTAiIGhlaWdodD0iOTAiIHZpZXdCb3g9IjAgMCA5MCA5MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iNDUiIGN5PSI0NSIgcj0iNDUiIGZpbGw9IiNjY2MiLz4KPHBhdGggZD0iTTQ1IDIwQzM3LjI3IDE5Ljc1IDMwLjI1QzM3LjI3IDMwLjI1IDMwLjI1IDMwLjI1IDMwLjI1IDM3LjI1QzMwLjI1IDM3LjI1IDMwLjI1IDQ1IDMwLjI1IDQ1QzMwLjI1IDQ1IDMwLjI1IDUyLjUgMzAuMjUgNTIuNUMzMC4yNSA1Mi41IDMwLjI1IDYwIDMwLjI1IDYwQzMwLjI1IDYwIDM3LjI1IDYwIDM3LjI1IDYwQzM3LjI1IDYwIDQ1IDYwIDQ1IDYwQzQ1IDYwIDUyLjUgNjAgNTIuNSA2MEM1Mi41IDYwIDUyLjUgNTIuNSA1Mi41IDUyLjVDNTIuNSA1Mi41IDUyLjUgNDUgNTIuNSA0NUM1Mi41IDQ1IDUyLjUgMzcuMjUgNTIuNSAzNy4yNUM1Mi41IDM3LjI1IDQ1IDM3LjI1IDQ1IDIwWiIgZmlsbD0iIzk5OSI+PC9wYXRoPgo8L3N2Zz4=';

  // Load user data from Firebase
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            const userData = {
              username: data.fullName || 'User',
              email: data.email || user.email,
              phone: data.phone || '',
            };
            setFormData(userData);
            localStorage.setItem('username', userData.username);
            localStorage.setItem('email', userData.email);
            localStorage.setItem('phone', userData.phone);
          }
          const storedImage = localStorage.getItem('profileImage') || defaultPlaceholder;
          setProfileImage(storedImage);
        } catch (error) {
          console.error('Error loading user data:', error);
        }
      } else {
        navigate('/welcome');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [navigate]);

  // Listen for localStorage changes to sync photo across pages
  useEffect(() => {
    const handleStorageChange = () => {
      const updatedImage = localStorage.getItem('profileImage') || defaultPlaceholder;
      setProfileImage(updatedImage);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
    validatePasswordField(name, value);
  };

  // Validate password fields
  const validatePasswordField = (name, value) => {
    const newErrors = { ...passwordErrors };
    if (name === 'newPassword') {
      if (value.length < 8) {
        newErrors.newPassword = 'Password must be at least 8 characters.';
      } else {
        delete newErrors.newPassword;
      }
    }
    if (name === 'confirmPassword') {
      if (value !== passwordData.newPassword) {
        newErrors.confirmPassword = 'Passwords do not match.';
      } else {
        delete newErrors.confirmPassword;
      }
    }
    setPasswordErrors(newErrors);
  };

  // Save profile changes
  const handleSave = async () => {
    const user = auth.currentUser;
    if (user) {
      try {
        await updateDoc(doc(db, 'users', user.uid), {
          fullName: formData.username,
          email: formData.email,
          phone: formData.phone,
        });
        localStorage.setItem('username', formData.username);
        localStorage.setItem('email', formData.email);
        localStorage.setItem('phone', formData.phone);
        setIsEditing(false);
        alert('Profile updated successfully!');
      } catch (error) {
        console.error('Error updating profile:', error);
        alert('Failed to update profile.');
      }
    }
  };

  // Handle change password
  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (Object.keys(passwordErrors).length > 0 || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      alert('Please fill all fields and fix errors.');
      return;
    }

    setLoading(true);
    const user = auth.currentUser;
    if (user) {
      try {
        const credential = EmailAuthProvider.credential(user.email, passwordData.currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, passwordData.newPassword);
        alert('Password changed successfully!');
        setIsChangePasswordOpen(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } catch (error) {
        console.error('Error changing password:', error);
        if (error.code === 'auth/wrong-password') {
          setPasswordErrors({ general: 'Current password is incorrect.' });
        } else {
          setPasswordErrors({ general: 'Failed to change password. Try again.' });
        }
      }
    }
    setLoading(false);
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size too large. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = reader.result;
        setProfileImage(imageData);
        localStorage.setItem('profileImage', imageData); // Sync
      };
      reader.onerror = () => {
        alert('Failed to upload photo. Try again.');
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please select a valid image file.');
    }
  };

  // Trigger file input
  const triggerFileInput = () => {
    document.getElementById('profile-file-input').click();
  };

  // Remove photo
  const removePhoto = () => {
    setProfileImage(defaultPlaceholder);
    localStorage.removeItem('profileImage'); // Sync
  };

  // Logout
  const handleLogout = () => {
    auth.signOut();
    localStorage.clear();
    navigate('/welcome');
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile-page">
      {/* App Bar */}
      <header className="app-bar">
        <div className="hamburger" onClick={() => setIsMenuOpen(true)}>☰</div>
        <div className="logo-H-container">
          <img src={logo} alt="StyleU Logo" className="logo-H" />
          <span className="logo-H-text">StyleU</span>
        </div>
        <div className="profile-icon" onClick={() => setIsProfileOpen(true)}>👤</div>
      </header>

      {/* Profile Title */}
      <h1 className="profile-page-title">My Profile</h1>

      {/* Profile Card */}
      <div className="profile-card">
        {/* Profile Photo Section */}
        <div className="profile-photo-section">
          <div className="profile-photo-container">
            <img src={profileImage} alt="Profile" className="profile-photo" />
            <div className="camera-icon" onClick={triggerFileInput}>📷</div>
            <div className="remove-icon" onClick={removePhoto}>❌</div>
          </div>
          <p className="username-display">{formData.username}</p>
        </div>

        {/* Form Section */}
        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="form-group">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className="form-input"
            />
          </div>
          <div className="button-group">
            {isEditing ? (
              <>
                <button type="button" className="save-btn" onClick={handleSave}>
                  Save Changes
                </button>
                <button type="button" className="cancel-btn" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
              </>
            ) : (
              <button type="button" className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            )}
            <button type="button" className="change-password-btn" onClick={() => setIsChangePasswordOpen(true)}>
              Change Password
            </button>
            <button type="button" className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </form>
      </div>

      {/* Change Password Popup */}
      {isChangePasswordOpen && (
        <div className="popup-overlay" onClick={() => setIsChangePasswordOpen(false)}>
          <div className="change-password-popup" onClick={(e) => e.stopPropagation()}>
            <h3 className="popup-title">Change Password</h3>
            <form onSubmit={handleChangePassword} className="popup-form">
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                />
                {passwordErrors.newPassword && <p className="error">{passwordErrors.newPassword}</p>}
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="form-input"
                  required
                />
                {passwordErrors.confirmPassword && <p className="error">{passwordErrors.confirmPassword}</p>}
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Changing...' : 'Change Password'}
              </button>
              {passwordErrors.general && <p className="error">{passwordErrors.general}</p>}
            </form>
            <button className="close-btn" onClick={() => setIsChangePasswordOpen(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Hidden file input */}
      <input
        type="file"
        id="profile-file-input"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {/* Popup for Menu and Profile */}
      <Popup
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
      />
    </div>
  );
};

export default Profile;