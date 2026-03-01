import React, { createContext, useContext, useState, useEffect } from 'react';

const Appcontext = createContext();

export const AppProvider = ({ children }) => {
  // Load saved theme from localStorage (persist across refreshes)
  const [theme, setThemeState] = useState(localStorage.getItem('theme') || 'light');

  // ── Theme: apply CSS class to <body> and save
  const setTheme = (val) => {
    setThemeState(val);
    localStorage.setItem('theme', val);
  };

  // Apply theme class to <body> whenever it changes
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <Appcontext.Provider value={{ theme, setTheme }}>
      {children}
    </Appcontext.Provider>
  );
};

// Custom hook — use this in every component
export const useApp = () => useContext(Appcontext);