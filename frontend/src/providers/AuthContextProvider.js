import React, { useState, useEffect, useCallback } from 'react';
import { LOCAL_STORAGE } from 'utils/consts';

const AuthContext = React.createContext({
  isLogged: false,
  login: () => {},
  logout: () => {}
});

const accessToken = localStorage.getItem(LOCAL_STORAGE.accessToken);

const AuthContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem(LOCAL_STORAGE.accessToken));

  const login = useCallback(async () => {
    setIsLogged(true);
  }, []);

  useEffect(() => {
    if (accessToken) {
      login();
    }
  }, [login]);

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
