import { useEffect, useRef } from 'react';
import { WEBSOCKET_MESSAGES } from 'utils/consts';

export const useSocketLeave = (websocket, username, sendJsonMessage) => {
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(websocket);
    const beforeUnloadHandler = () => {
      sendJsonMessage(WEBSOCKET_MESSAGES.leave(username));
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [websocket, username, sendJsonMessage]);

  return { socketRef };
};
