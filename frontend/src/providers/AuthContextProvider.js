import React, { useState, useEffect } from 'react';
import { LOCAL_STORAGE } from 'utils/consts';

const accessToken = localStorage.getItem(LOCAL_STORAGE.accessToken);

const AuthContext = React.createContext({
  isLogged: false,
  login: () => {},
  logout: () => {}
});

const AuthContextProvider = ({ children }) => {
  const [isLogged, setIsLogged] = useState(!!accessToken);

  useEffect(() => {
    setIsLogged(!!accessToken);
  }, []);

  const login = () => setIsLogged(true);
  const logout = () => setIsLogged(false);

  return (
    <AuthContext.Provider value={{ isLogged, login, logout }}>{children}</AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
