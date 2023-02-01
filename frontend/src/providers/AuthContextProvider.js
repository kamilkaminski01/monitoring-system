import React, { useState, useEffect } from 'react';
import { LOCAL_STORAGE } from 'utils/consts';

const AuthContext = React.createContext({
  isLogged: false,
  login: () => {},
  logout: () => {}
});

const AuthContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem(LOCAL_STORAGE.accessToken));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsLogged(!!localStorage.getItem(LOCAL_STORAGE.accessToken));
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const login = (accessToken, refreshToken) => {
    localStorage.setItem(LOCAL_STORAGE.accessToken, accessToken);
    localStorage.setItem(LOCAL_STORAGE.refreshToken, refreshToken);
    setIsLogged(true);
  };
  const logout = () => {
    localStorage.removeItem(LOCAL_STORAGE.accessToken);
    localStorage.removeItem(LOCAL_STORAGE.refreshToken);
    setIsLogged(false);
  };

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
