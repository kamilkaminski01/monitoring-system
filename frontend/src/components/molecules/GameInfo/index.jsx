import './style.scss'
import { IoClose, IoCheckmark } from 'react-icons/io5'
import { FiInfo } from 'react-icons/fi'
import { putRoomDetailsPlayer } from 'utils/requests'
import { WEBSOCKET_MESSAGES } from 'utils/consts'
import Button from 'components/atoms/Button'

const GameInfo = ({ players, username, roomName, endpoint, sendJsonMessage }) => {
  const handleSetReady = async () => {
    await putRoomDetailsPlayer(endpoint, roomName, username, { is_ready: true })
    sendJsonMessage(WEBSOCKET_MESSAGES.ready(username))
  }

  return (
    <div className="game-info animation--fade-in">
      <h2 className="info__title">{roomName}</h2>
      <div className="info__content">
        {players.map((player) => (
          <div key={player.username} className="content__player-info">
            <div className="player-info__username">{player.username}</div>
            {player.username === username && !player.is_ready ? (
              <Button onClick={() => handleSetReady()}>Ready?</Button>
            ) : player.is_ready ? (
              <IoCheckmark key={player.is_ready} className="checkmark-icon animation--fade-in" />
            ) : (
              <IoClose key={player.is_ready} className="cancel-icon animation--fade-in" />
            )}
          </div>
        ))}
      </div>
      <div className="info__footer">
        <FiInfo className="info-icon" />
        Your turn depends on who first marks &ldquo;Ready?&ldquo;
      </div>
    </div>
  )
}

export default GameInfo
