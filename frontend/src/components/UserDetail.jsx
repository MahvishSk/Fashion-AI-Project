import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import '../styles/UserDetail.css'; // Make sure your CSS file is linked

const UserDetail = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    body_type: '',
    height: '',
    weight: '',
    skin_tone: '',
  });

  const [loading, setLoading] = useState(false);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Form Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = auth.currentUser;
      
      if (user) {
        // Save to Firestore inside 'users' collection using UID
        await setDoc(doc(db, 'users', user.uid), {
          ...formData,
          profileCompleted: true, // Flag to check if profile is done
          updatedAt: new Date(),
        }, { merge: true }); // merge: true keeps existing data (like email from signup)

        alert('Profile Saved Successfully!');
        navigate('/home');
      } else {
        alert('User not logged in. Please login again.');
        navigate('/login');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('Error saving profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Complete Your Profile</h2>
        <p className="subtitle">Help us find the perfect look for you!</p>
        
        <form onSubmit={handleSubmit} className="profile-form">
          
          {/* New Fields Added */}
          <div className="form-group">
            <label>Age</label>
            <input
              type="number"
              name="age"
              placeholder="e.g., 24"
              value={formData.age}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} required>
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Body Type</label>
            <select name="body_type" value={formData.body_type} onChange={handleChange} required>
              <option value="">Select Body Type</option>
              <option value="slim">Slim</option>
              <option value="athletic">Athletic</option>
              <option value="average">Average</option>
              <option value="curvy">Curvy</option>
              <option value="plus_size">Plus Size</option>
            </select>
          </div>

          {/* Original Fields */}
          <div className="form-group">
            <label>Height (in feet)</label>
            <input
              type="text"
              name="height"
              placeholder="e.g., 5.2"
              value={formData.height}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Weight (in kg)</label>
            <input
              type="number"
              name="weight"
              placeholder="e.g., 60"
              value={formData.weight}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Skin Tone</label>
            <select name="skin_tone" value={formData.skin_tone} onChange={handleChange} required>
              <option value="">Select Skin Tone</option>
              <option value="fair">Fair / Light</option>
              <option value="wheatish">Wheatish / Medium</option>
              <option value="dusky">Dusky / Dark</option>
            </select>
          </div>

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Start Styling 💃'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserDetail;