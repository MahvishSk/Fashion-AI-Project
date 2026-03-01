import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
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

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (token && username) {
      setShowSplash(false);
      navigate("/home");
      return;
    }

    if (window.location.pathname === "/") {
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate("/welcome");
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      setShowSplash(false);
    }
  }, [navigate]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem("username", userData.username);
    localStorage.setItem("token", userData.token);
    navigate("/home");
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          {/* ✅ Fix for "/" route warning */}
          <Route path="/" element={<Navigate to="/welcome" />} />

          <Route
            path="/welcome"
            element={<Welcome onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user-detail" element={<UserDetail />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      )}
    </>
  );
}

export default App;
