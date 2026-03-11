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
import Trends from "./components/Trends";
import HelpCenter from "./components/HelpCenter"; 
import ContactUs from "./components/ContactUs";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if user is logged in
  const isAuthenticated = () => {
    return !!(localStorage.getItem("token") && localStorage.getItem("username"));
  };

  useEffect(() => {
    // ALWAYS show splash for 3 seconds on every app open
    const splashTimer = setTimeout(() => {
      setShowSplash(false);
      setInitialCheckDone(true);
    }, 3000);

    return () => clearTimeout(splashTimer);
  }, []); // Run only once on mount

  useEffect(() => {
    // Only run navigation logic after splash is done
    if (!initialCheckDone) return;

    const auth = isAuthenticated();
    const currentPath = location.pathname;

    // Don't redirect if already on auth pages
    const authPages = ['/welcome', '/login', '/signup', '/forgot-password'];
    const isOnAuthPage = authPages.includes(currentPath);

    if (auth) {
      // User is logged in
      if (currentPath === "/" || currentPath === "/welcome") {
        navigate("/home", { replace: true });
      }
    } else {
      // User is NOT logged in (guest)
      // Only redirect to home if on root path, NOT if on auth pages
      if (currentPath === "/" && !isOnAuthPage) {
        navigate("/home", { replace: true });
      }
      // If on auth pages, stay there (don't redirect)
    }
  }, [initialCheckDone, location.pathname, navigate]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("username", userData.username);
    localStorage.setItem("token", userData.token);
    window.dispatchEvent(new Event("userLoggedIn"));
    navigate("/home", { replace: true });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    window.dispatchEvent(new Event("userLoggedOut"));
    navigate("/welcome", { replace: true });
  };

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/welcome" element={<Welcome onLoginSuccess={handleLoginSuccess} />}/>
      <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/signup" element={<Signup onLoginSuccess={handleLoginSuccess} />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/help" element={<HelpCenter />} />
      <Route path="/contact" element={<ContactUs />} />

      {/* Home - Accessible to everyone (Guest mode) */}
      <Route path="/home" element={<Home onLogout={handleLogout} />} />
      <Route path="/" element={<Home onLogout={handleLogout} />} />

          {/* Protected Routes */}
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/chatbot" element={<ProtectedRoute><Chatbot /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/user-detail" element={<ProtectedRoute><UserDetail /></ProtectedRoute>} />
          <Route path="/saved" element={<ProtectedRoute><SavedLooks /></ProtectedRoute>} />
          <Route path="/trending" element={<ProtectedRoute><Trends /></ProtectedRoute>} />

          {/* Default Route */}
          <Route path="/" element={<SplashScreen />} />
        </Routes>
  );
}

export default App;