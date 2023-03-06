import React, { useEffect, useRef, useState } from 'react';
import './Chat.scss';
import { useSocketChat } from 'hooks/useSocketChat';

const Chat = ({ websocket, username }) => {
  const { messages, sendMessage } = useSocketChat(websocket, username);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    sendMessage(newMessage.trim());
    setNewMessage('');
  };

  const [newMessage, setNewMessage] = useState('');

  const handleNewMessage = (e) => {
    setNewMessage(e.target.value);
  };

  return (
    <div className="chat-wrapper">
      <div className="chat">
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
                <span className="message-user"> {message.user} </span>
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
          onChange={handleNewMessage}
        />
      </form>
    </div>
  );
};

export default Chat;
