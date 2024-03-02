import './style.scss'
import Checkmark from 'assets/icons/checkmark.svg'
import Cancel from 'assets/icons/cancel.svg'

const MonitoringPlayerInfo = ({ player }) => {
  return (
    <div className="monitoring-player-info">
      <h4 className="monitoring-player-info__username">{player.username}</h4>
      <div className="monitoring-player-info__item">
        Active:
        <img
          key={player.isActive}
          src={player.isActive ? Checkmark : Cancel}
          alt="is-active"
          className="animation--fade-in"
        />
      </div>
      <div className="monitoring-player-info__item">
        Winner:
        <img
          key={player.isWinner}
          src={player.isWinner ? Checkmark : Cancel}
          alt="is-winner"
          className="animation--fade-in"
        />
      </div>
      <div className="monitoring-player-info__item">
        Ready:
        <img
          key={player.isReady}
          src={player.isReady ? Checkmark : Cancel}
          alt="is-ready"
          className="animation--fade-in"
        />
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
