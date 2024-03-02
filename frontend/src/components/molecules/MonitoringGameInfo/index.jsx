import './style.scss'
import Checkmark from 'assets/icons/checkmark.svg'
import Cancel from 'assets/icons/cancel.svg'

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
          <img
            key={gameState}
            className="animation--fade-in"
            src={gameState ? Checkmark : Cancel}
            alt="game-state"
          />
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
