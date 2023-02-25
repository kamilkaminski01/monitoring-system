import { useState, useEffect } from 'react';
import { LOCAL_STORAGE } from 'utils/consts';

export const useHomeData = (initialUsername = '', initialRoomName = '') => {
  const [username, setUsername] = useState(initialUsername);
  const [roomName, setRoomName] = useState(initialRoomName);

  useEffect(() => {
    setUsername(localStorage.getItem(LOCAL_STORAGE.username) || initialUsername);
  }, [initialUsername]);

  return {
    username,
    roomName,
    setUsername,
    setRoomName
  };
};
