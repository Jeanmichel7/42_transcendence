import Reac, { useState, createContext } from 'react';

export const ThemeContexte = createContext({});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('connected');
  const toggleTheme = () => {
    setTheme(theme === 'connected' ? 'disconnected' : 'connected');
  };
  return (
    <ThemeContexte.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContexte.Provider>
  );
};
