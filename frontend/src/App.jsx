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
import UserDetail from "./components/UserDetail";
import Chatbot from "./components/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute";
import SavedLooks from "./components/SavedLooks";
import TrendingFashion from "./components/TrendingFashion";
import HelpCenter from './components/HelpCenter';
import ContactUs from './components/ContactUs';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

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
          <Route path="/welcome" element={<Welcome onLoginSuccess={handleLoginSuccess} />}/>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Home */}
          <Route path="/home" element={<Home />} />

          {/* Protected Routes */}
          <Route path="/profile"  element={ <ProtectedRoute><Profile /></ProtectedRoute> }/>
          <Route path="/chatbot" element={ <ProtectedRoute><Chatbot /></ProtectedRoute> }/>
          <Route path="/settings" element={ <ProtectedRoute><Settings /></ProtectedRoute>  }/>
          <Route path="/user-detail"  element={ <ProtectedRoute><UserDetail /></ProtectedRoute>  }/>
          <Route path="/saved" element={ <ProtectedRoute><SavedLooks /></ProtectedRoute>} />
          <Route path="/trending" element={ <ProtectedRoute><TrendingFashion /></ProtectedRoute>} />
            
            {/* Default Route */}
          <Route path="/" element={<Home />} />
        </Routes>
      )}
    </>
  );
}

export default App;