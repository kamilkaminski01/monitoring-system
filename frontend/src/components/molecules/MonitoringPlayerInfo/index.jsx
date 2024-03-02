import './style.scss'
import { IoClose, IoCheckmark } from 'react-icons/io5'

const MonitoringPlayerInfo = ({ player }) => {
  return (
    <div className="monitoring-player-info">
      <h4 className="monitoring-player-info__username">{player.username}</h4>
      <div className="monitoring-player-info__item">
        Active:
        {player.isActive ? (
          <IoCheckmark key={player.isActive} className="checkmark-icon animation--fade-in" />
        ) : (
          <IoClose key={player.isActive} className="cancel-icon animation--fade-in" />
        )}
      </div>
      <div className="monitoring-player-info__item">
        Winner:
        {player.isWinner ? (
          <IoCheckmark key={player.isWinner} className="checkmark-icon animation--fade-in" />
        ) : (
          <IoClose key={player.isWinner} className="cancel-icon animation--fade-in" />
        )}
      </div>
      <div className="monitoring-player-info__item">
        Ready:
        {player.isReady ? (
          <IoCheckmark key={player.isReady} className="checkmark-icon animation--fade-in" />
        ) : (
          <IoClose key={player.isReady} className="cancel-icon animation--fade-in" />
        )}
      </div>
      {player.figure && (
        <div className="monitoring-player-info__item">
          Figure:
          <div key={player.figure} className="animation--fade-in">
            {player.figure}
          </div>
        </div>
      )}
    </div>
  )
}

export default MonitoringPlayerInfo
