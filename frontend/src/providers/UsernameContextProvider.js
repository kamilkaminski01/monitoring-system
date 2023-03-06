import React, { createContext, useState } from 'react';
import { LOCAL_STORAGE } from 'utils/consts';

const UsernameContext = createContext({
  isUsernameSet: false,
  username: '',
  setUsername: () => {}
});

const UsernameContextProvider = ({ children }) => {
  const [username, setUsername] = useState(localStorage.getItem(LOCAL_STORAGE.username) || '');
  const [isUsernameSet, setIsUsernameSet] = useState(
    !!localStorage.getItem(LOCAL_STORAGE.username)
  );

  const setUsernameInLocalStorage = (newUsername) => {
    localStorage.setItem(LOCAL_STORAGE.username, newUsername);
    setUsername(newUsername);
    setIsUsernameSet(true);
  };

  return (
    <UsernameContext.Provider
      value={{ username, setUsername: setUsernameInLocalStorage, isUsernameSet }}>
      {children}
    </UsernameContext.Provider>
  );
};

export { UsernameContext, UsernameContextProvider };
