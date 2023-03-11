import { useEffect } from 'react';
import { WEBSOCKET_MESSAGES } from 'utils/consts';

export const useSocketLeave = (websocket, username, sendJsonMessage) => {
  useEffect(() => {
    const onUnload = () => {
      sendJsonMessage(WEBSOCKET_MESSAGES.leave(username));
    };
    const onHideOrJoin = () => {
      if (document.visibilityState === 'hidden') {
        sendJsonMessage(WEBSOCKET_MESSAGES.leave(username));
      } else if (document.visibilityState === 'visible') {
        sendJsonMessage(WEBSOCKET_MESSAGES.join(username));
      }
    };
    'ontouchstart' in document
      ? document.addEventListener('visibilitychange', onHideOrJoin)
      : window.addEventListener('beforeunload', onUnload);
    return () => {
      'ontouchstart' in document
        ? document.removeEventListener('visibilitychange', onHideOrJoin)
        : window.removeEventListener('beforeunload', onUnload);
    };
  }, [websocket, username, sendJsonMessage]);
};
