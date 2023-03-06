import React, { useRef, useEffect } from 'react';
import './Chat.scss';
import useMessage from 'hooks/useMessage';

const Chat = ({ socketRef, username }) => {
  const { messages, newMessage, handleNewMessage, handleSubmit } = useMessage(socketRef, username);
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

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
                <span> {message.user} </span>
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
