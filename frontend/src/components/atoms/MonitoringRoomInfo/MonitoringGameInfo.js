import React from 'react';
import './MonitoringRoomInfo.scss';
import Checkmark from 'assets/icons/checkmark.svg';
import Cancel from 'assets/icons/cancel.svg';

const MonitoringGameInfo = ({
  roomName,
  gameState,
  totalPlayers,
  playersTurn,
  playersLimit = null,
  moves = null
}) => {
  return (
    <div className="monitoring-info">
      <h2>{roomName}</h2>
      <div className="monitoring-data room-data">
        <div>
          Game state:
          <img
            key={gameState}
            className="animate-data"
            src={gameState ? Checkmark : Cancel}
            alt="Game state"
          />
        </div>
        {playersLimit && (
          <div>
            Players limit:
            <div>{playersLimit}</div>
          </div>
        )}
        {totalPlayers && (
          <div>
            Total active players:
            <div key={totalPlayers} className="animate-data">
              {totalPlayers}
            </div>
          </div>
        )}
        {playersTurn && (
          <div>
            Players turn:
            <div key={playersTurn} className="animate-data">
              {playersTurn}
            </div>
          </div>
        )}
        {moves !== null && (
          <div>
            Moves:
            {moves === 0 ? (
              <div>0</div>
            ) : (
              <div key={moves} className="animate-data">
                {moves}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringGameInfo;
