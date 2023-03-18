import React from 'react';
import './MonitoringRoomInfo.scss';
import Checkmark from 'assets/icons/checkmark.svg';
import Cancel from 'assets/icons/cancel.svg';

const MonitoringRoomInfo = ({
  roomName,
  gameState,
  totalPlayers,
  playersTurn,
  playersLimit = null
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
        <div>
          Total active players:
          <div key={totalPlayers} className="animate-data">
            {totalPlayers}
          </div>
        </div>
        <div>
          Players turn:
          <div key={playersTurn} className="animate-data">
            {playersTurn}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MonitoringRoomInfo;
