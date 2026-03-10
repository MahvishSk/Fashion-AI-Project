import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Profile from "./components/Profile";
import Settings from "./components/Settings";
<<<<<<< Updated upstream
import UserDetail from "./components/UserDetail";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedLooks from "./components/SavedLooks";
<<<<<<< HEAD
=======
import UserDetail from './components/UserDetail';
import Chatbot from './components/Chatbot';
import ExploreStyles from './components/ExploreStyles';
import ProtectedRoute from './components/ProtectedRoute'; // ✅ NEW FILE
import SavedLooks from './components/SavedLooks';
import TrendingFashion from './components/TrendingFashion';
>>>>>>> Stashed changes
=======
import Trends from "./components/Trends";
>>>>>>> f0521c4f81ea313df8d9e9b56cd13790902fd7fb

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const [savedOutfits, setSavedOutfits] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setShowSplash(false);
      if (location.pathname === "/" || location.pathname === "/welcome") {
        navigate("/home");
      }
      return;
    }

    if (location.pathname === "/") {
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate("/home");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [navigate, location.pathname]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("username", userData.username);
    localStorage.setItem("token", userData.token);
    window.dispatchEvent(new Event("userLoggedIn"));
    navigate("/home");
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          {/* Public Routes */}
          <Route
            path="/welcome"
            element={<Welcome onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
<<<<<<< Updated upstream

          {/* Home */}
          <Route path="/home" element={<Home />} />

          {/* Chatbot - Guest allowed */}
          <Route
            path="/chatbot"
            element={
              <ProtectedRoute allowGuest={true}>
                <Chatbot />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-detail"
            element={
              <ProtectedRoute>
                <UserDetail />
              </ProtectedRoute>
            }
          />
=======
          <Route path="/category/:category" element={<ExploreStyles />} />
          <Route path="/category/all" element={<ProtectedRoute><ExploreStyles /></ProtectedRoute> } />

         
          {/* Home - Public but shows popup after 10s */}
          <Route path="/home" element={<Home />} />

          {/* Protected Routes - Login required */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/user-detail" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
          <Route path="/explore" element={<ProtectedRoute><ExploreStyles /></ProtectedRoute>} />
          <Route path="/trending" element={<ProtectedRoute><TrendingFashion /></ProtectedRoute>} />
          <Route path="/saved-looks" element={<ProtectedRoute><SavedLooks /></ProtectedRoute>} />
>>>>>>> Stashed changes

          {/* Default Route */}
          <Route path="/" element={<Home />} />
<<<<<<< Updated upstream
          <Route path="/saved" element={<SavedLooks />} />
<<<<<<< HEAD
=======
          <Route path="/" element={<ExploreStyles savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} />} />
          <Route path="/saved" element={<SavedLooks savedOutfits={savedOutfits} setSavedOutfits={setSavedOutfits} />} />
>>>>>>> Stashed changes
=======
          <Route path="/trends" element={<Trends />} />
>>>>>>> f0521c4f81ea313df8d9e9b56cd13790902fd7fb
        </Routes>
      )}
    </>
  );
}

export default App;
