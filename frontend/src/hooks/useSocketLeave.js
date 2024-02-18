import { useEffect } from 'react'
import { WEBSOCKET_MESSAGES } from 'utils/consts'

export const useSocketLeave = (websocket, username, sendJsonMessage) => {
  let beforeUnloadFired = false

  const onUnload = () => {
    if (!beforeUnloadFired) {
      beforeUnloadFired = true
      sendJsonMessage(WEBSOCKET_MESSAGES.leave(username))
    }
  }

  const onHideOrJoin = () => {
    if (document.visibilityState === 'hidden') {
      sendJsonMessage(WEBSOCKET_MESSAGES.leave(username))
    } else if (document.visibilityState === 'visible') {
      setTimeout(() => {
        sendJsonMessage(WEBSOCKET_MESSAGES.join(username))
      }, 750)
    }
  }

  useEffect(() => {
    if ('ontouchstart' in document) {
      document.addEventListener('visibilitychange', onHideOrJoin)
    } else {
      window.addEventListener('beforeunload', onUnload)
      window.addEventListener('unload', onUnload)
    }

    return () => {
      if ('ontouchstart' in document) {
        document.removeEventListener('visibilitychange', onHideOrJoin)
      } else {
        window.removeEventListener('beforeunload', onUnload)
        window.removeEventListener('unload', onUnload)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [websocket, username])
}
