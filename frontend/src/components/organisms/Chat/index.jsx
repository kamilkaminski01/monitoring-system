import { useEffect, useRef, useState } from 'react'
import './style.scss'
import { WEBSOCKET_MESSAGES } from 'utils/consts'
import useWebSocket from 'react-use-websocket'
import Input from 'components/atoms/Input'

const Chat = ({ websocket, username }) => {
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState('')
  const chatRef = useRef(null)

  const { sendJsonMessage } = useWebSocket(websocket, {
    onMessage: (event) => {
      const data = JSON.parse(event.data)
      if (data.message) {
        setMessages((prevMessages) => [...prevMessages, data])
      }
    }
  })

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = (event) => {
    event.preventDefault()
    const message = newMessage.trim()
    if (message) {
      sendJsonMessage(WEBSOCKET_MESSAGES.message(message, username))
      setNewMessage('')
    }
  }

  return (
    <div className="chat">
      <div className="chat__content" ref={chatRef}>
        <h4 className="chat__title">Room Activity</h4>
        {messages.map((message, index) => (
          <div key={index} className="chat__message">
            {['join', 'leave', 'win', 'restart'].includes(message.command) ? (
              <span className="message--centered">{message.message}</span>
            ) : (
              <div className="message__user">
                <span>{message.user ? message.user : 'admin'}:</span>
                <span className="message__user-message">{message.message}</span>
              </div>
            )}
          </div>
        ))}
      </div>
      <form className="chat__form" onSubmit={handleSubmit}>
        <Input
          placeholder="send a message"
          value={newMessage}
          className="chat__input"
          onChange={(event) => setNewMessage(event.target.value)}
        />
      </form>
    </div>
  )
}

export default Chat
