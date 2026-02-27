// AppContext.jsx
// Wrap your entire app with <AppProvider> in main.jsx / App.jsx
// Then use:  const { theme, language, t, setTheme, setLanguage } = useApp();

import React, { createContext, useContext, useState, useEffect } from 'react';
import translations from './Translation';

const Appcontext = createContext();

export const AppProvider = ({ children }) => {
  // Load saved values from localStorage (persist across refreshes)
  const [theme, setThemeState]       = useState(localStorage.getItem('theme')    || 'light');
  const [language, setLanguageState] = useState(localStorage.getItem('language') || 'English');

  // Translation shortcut
  const t = translations[language];

  // ── Theme: apply CSS class to <body> and save
  const setTheme = (val) => {
    setThemeState(val);
    localStorage.setItem('theme', val);
  };

  // ── Language: save and update
  const setLanguage = (val) => {
    setLanguageState(val);
    localStorage.setItem('language', val);
  };

  // Apply theme class to <body> whenever it changes
  useEffect(() => {
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  return (
    <Appcontext.Provider value={{ theme, setTheme, language, setLanguage, t }}>
      {children}
    </Appcontext.Provider>
  );
};

// Custom hook — use this in every component
export const useApp = () => useContext(Appcontext);