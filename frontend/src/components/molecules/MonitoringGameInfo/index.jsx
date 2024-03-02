import './style.scss'
import { IoClose, IoCheckmark } from 'react-icons/io5'

const MonitoringGameInfo = ({
  roomName,
  gameState,
  totalPlayers,
  playersTurn,
  playersLimit = null,
  moves = null
}) => {
  return (
    <div className="monitoring-game-info">
      <h2 className="monitoring-game-info__room-name">{roomName}</h2>
      <div className="monitoring-game-info__items">
        <div className="monitoring-game-info__item">
          Game state:
          {gameState ? (
            <IoCheckmark key={gameState} className="checkmark-icon animation--fade-in" />
          ) : (
            <IoClose key={gameState} className="cancel-icon animation--fade-in" />
          )}
        </div>
        {playersLimit && (
          <div className="monitoring-game-info__item">
            Players limit:
            <div>{playersLimit}</div>
          </div>
        )}
        {totalPlayers && (
          <div className="monitoring-game-info__item">
            Active players:
            <div key={totalPlayers} className="animation--fade-in">
              {totalPlayers}
            </div>
          </div>
        )}
        {playersTurn && (
          <div className="monitoring-game-info__item">
            Players turn:
            <div key={playersTurn} className="animation--fade-in">
              {playersTurn}
            </div>
          </div>
        )}
        {moves !== null && (
          <div className="monitoring-game-info__item">
            Moves:
            {moves === 0 ? (
              <div>0</div>
            ) : (
              <div key={moves} className="animation--fade-in">
                {moves}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MonitoringGameInfo
