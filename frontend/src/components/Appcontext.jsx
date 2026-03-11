import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";

const Appcontext = createContext();

export const useAuth = () => useContext(Appcontext);
export const useApp = () => useContext(Appcontext);

export const AppProvider = ({ children }) => {
  // ── Theme State ──
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');
  const setTheme = (val) => {
    setThemeState(val);
    localStorage.setItem('theme', val);
  };

  // ── Auth State ──
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Apply theme class to <body> whenever it changes
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    theme,
    setTheme,
    currentUser,
    loading,
  };

  return (
    <Appcontext.Provider value={value}>
      {!loading && children}
    </Appcontext.Provider>
  );
};

export default AppProvider;