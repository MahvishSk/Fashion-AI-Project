import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
import Profile from "./components/Profile";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in (has token and username)
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setShowSplash(false);
      navigate("/home"); // Skip splash and go to home if logged in
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
    // Store username in localStorage (consistent with login updates)
    localStorage.setItem("username", userData.username);
    localStorage.setItem("token", userData.token); // Also store token if needed
    navigate("/home");
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route
            path="/welcome"
            element={<Welcome onLoginSuccess={handleLoginSuccess} />}
          />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
           <Route path="/profile" element={<Profile />} />
        </Routes>
      )}
    </>
  );
}

export default App;