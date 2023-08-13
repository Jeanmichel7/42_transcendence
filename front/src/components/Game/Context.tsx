import { useState, createContext } from 'react';

export const ThemeContexte = createContext({});

interface ThemeProviderProps {
  children: React.ReactNode;
}
export const ThemeProvider = ({ children }: ThemeProviderProps) => {
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
