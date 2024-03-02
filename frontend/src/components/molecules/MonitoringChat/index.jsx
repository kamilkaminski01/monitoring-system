import { useState } from 'react'
import './style.scss'
import Chat from 'components/organisms/Chat'
import { BsChatFill } from 'react-icons/bs'

const MonitoringChat = ({ websocket, username }) => {
  const [visible, setVisible] = useState(false)

  return (
    <div className="monitoring-chat">
      <BsChatFill color="white" className="chat-icon" onClick={() => setVisible(!visible)} />
      <div
        className={
          visible
            ? 'animate__animated animate__fadeIn fade-on-open'
            : 'animate__animated animate__fadeOut fade-on-close'
        }>
        <Chat websocket={websocket} username={username} />
      </div>
    </div>
  )
}

export default MonitoringChat
