import React, { useEffect, useRef, useState } from 'react';
import './Chat.scss';
import { WEBSOCKET_MESSAGES } from 'utils/consts';
import useWebSocket from 'react-use-websocket';

const Chat = ({ websocket, username }) => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const chatRef = useRef(null);

  const { sendJsonMessage } = useWebSocket(websocket, {
    onMessage: (event) => {
      const data = JSON.parse(event.data);
      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data]);
      }
    }
  });

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const message = newMessage.trim();
    if (message) {
      sendJsonMessage(WEBSOCKET_MESSAGES.message(message, username));
      setNewMessage('');
    }
  };

  return (
    <div className="chat-wrapper">
      <div className="chat" ref={chatRef}>
        <h6>Room Activity</h6>
        {messages.map((message, index) => (
          <div key={index}>
            {['join', 'leave', 'win', 'restart'].includes(message.command) ? (
              <div className="centered-message">
                <span> {message.message} </span>
              </div>
            ) : (
              <div className="message">
                <span> {message.message} </span>
                <span className="message-user"> {message.user ? message.user : 'admin'} </span>
              </div>
            )}
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="form-control my-1"
          autoComplete="off"
          placeholder="send a message"
          value={newMessage}
          onChange={(event) => setNewMessage(event.target.value)}
        />
      </form>
    </div>
  );
};

export default Chat;
