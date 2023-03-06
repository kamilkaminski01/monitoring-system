import { useState, useEffect, useCallback } from 'react';

const useMessage = (socketRef, username) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  const handleMessage = useCallback((message) => {
    setMessages((prevMessages) => [...prevMessages, message]);
  }, []);

  useEffect(() => {
    const socket = socketRef.current;
    if (socket === null) return;
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        handleMessage(data);
      }
    };
  }, [socketRef, handleMessage]);

  const handleNewMessage = useCallback((e) => {
    setNewMessage(() => e.target.value);
  }, []);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (!newMessage.trim()) return;
      const socket = socketRef.current;
      if (socket !== null && socket.readyState === WebSocket.OPEN) {
        socket.send(
          JSON.stringify({ command: 'message', message: newMessage.trim(), user: username })
        );
      }
      setNewMessage(() => '');
    },
    [socketRef, newMessage, username]
  );

  return { messages, newMessage, handleNewMessage, handleSubmit };
};

export default useMessage;
