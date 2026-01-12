import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import SplashScreen from "./components/SplashScreen";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
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
    localStorage.setItem("user", JSON.stringify(userData));
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
        </Routes>
      )}
    </>
  );
}

export default App;
