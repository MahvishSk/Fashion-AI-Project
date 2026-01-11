<<<<<<< HEAD
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/Login.jsx";
import Signup from "./components/Signup.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
=======
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import SplashScreen from "./components/SplashScreen";
import Welcome from "./components/Welcome";
import Login from "./components/Login";
import Signup from "./components/Signup";
import ForgotPassword from "./components/ForgotPassword";
import Home from "./components/Home";
>>>>>>> 3941287c082c467290b46966966e7b8dc0f50a45

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (window.location.pathname === "/") {
      const timer = setTimeout(() => {
        setShowSplash(false);
        navigate('/welcome');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const handleLoginSuccess = (userData) => {
    localStorage.setItem('user', JSON.stringify(userData));
    navigate('/home');
  };

  return (
<<<<<<< HEAD
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
=======
    <>
      {showSplash ? (
        <SplashScreen />
      ) : (
        <Routes>
          <Route path="/welcome" element={<Welcome onLoginSuccess={handleLoginSuccess} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/home" element={<Home />} />
        </Routes>
      )}
    </>
>>>>>>> 3941287c082c467290b46966966e7b8dc0f50a45
  );
}

export default App;