import { useEffect } from 'react';
import { WEBSOCKET_MESSAGES } from 'utils/consts';

export const useSocketLeave = (websocket, username, sendJsonMessage) => {
  useEffect(() => {
    const beforeUnloadHandler = () => {
      sendJsonMessage(WEBSOCKET_MESSAGES.leave(username));
    };
    window.addEventListener('beforeunload', beforeUnloadHandler);
    return () => {
      window.removeEventListener('beforeunload', beforeUnloadHandler);
    };
  }, [websocket, username, sendJsonMessage]);
};
