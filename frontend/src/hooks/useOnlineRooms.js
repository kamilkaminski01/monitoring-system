import { useEffect, useState } from 'react';

export const useOnlineRooms = (url, onMessage) => {
  const [socket] = useState(new WebSocket(url));

  useEffect(() => {
    socket.onmessage = onMessage;

    return () => {
      socket.close();
    };
  }, [socket, onMessage]);

  return socket;
};
