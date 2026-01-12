import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import '../styles/Signup.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    validateField(name, value);
  };

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case 'fullName':
        if (!/^[a-zA-Z\s]+$/.test(value)) {
          newErrors.fullName = 'Only letters allowed';
        } else {
          delete newErrors.fullName;
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          newErrors.email = 'Invalid email';
        } else {
          delete newErrors.email;
        }
        break;
      case 'phone':
        if (!/^\d{10}$/.test(value)) {
          newErrors.phone = 'Only numbers allowed';
        } else {
          delete newErrors.phone;
        }
        break;
      case 'password':
        if (
          !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)
        ) {
          newErrors.password =
            'Password must contain 8 chars, uppercase, number, symbol';
        } else {
          delete newErrors.password;
        }
        break;
      default:
        break;
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length === 0) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );

        const user = userCredential.user;

        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          createdAt: serverTimestamp(),
        });

        setShowPopup(true);
        setTimeout(() => {
          setShowPopup(false);
          navigate('/home');
        }, 1000);
      } catch (error) {
        setErrors({ general: 'Signup failed' });
      }
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          value={formData.fullName}
          onChange={handleChange}
          className="input-field"
          required
        />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          className="input-field"
          required
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleChange}
          className="input-field"
          required
        />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="input-field password-input"
            required
          />
          <span
            className="eye-icon"
            onClick={togglePasswordVisibility}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        {errors.password && <p className="error">{errors.password}</p>}

        <button type="submit" className="submit-btn">
          Sign Up
        </button>

        {errors.general && <p className="error">{errors.general}</p>}
      </form>

      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <div className="tick">✓</div>
            <p>Signup Successful</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Signup;
