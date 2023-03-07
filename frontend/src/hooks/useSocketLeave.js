import { useEffect } from 'react';
import { WEBSOCKET_MESSAGES } from 'utils/consts';

export const useSocketLeave = (websocket, username, sendJsonMessage) => {
  const terminationEvent = 'onpagehide' in self ? 'pagehide' : 'unload';
  useEffect(() => {
    const beforeUnloadHandler = () => {
      sendJsonMessage(WEBSOCKET_MESSAGES.leave(username));
    };
    window.addEventListener(terminationEvent, beforeUnloadHandler);
    return () => {
      window.removeEventListener(terminationEvent, beforeUnloadHandler);
    };
  }, [websocket, username, sendJsonMessage, terminationEvent]);
};
