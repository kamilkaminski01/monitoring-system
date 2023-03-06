import { useState } from 'react';
import useWebSocket from 'react-use-websocket';

export const useSocketChat = (websocket, username) => {
  const [messages, setMessages] = useState([]);

  const { sendJsonMessage } = useWebSocket(websocket, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    }
  });

  const sendMessage = (message) => {
    sendJsonMessage({
      command: 'message',
      message,
      user: username
    });
  };

  return { messages, sendMessage };
};
