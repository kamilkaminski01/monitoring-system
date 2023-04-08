import React from 'react';
import './GameInfo.scss';
import Ready from 'assets/icons/ready.png';
import NotReady from 'assets/icons/not-ready.png';
import InfoBlack from 'assets/icons/info-black.png';
import InfoWhite from 'assets/icons/info-white.png';
import { putRoomDetailsPlayer } from 'utils/requests';
import { WEBSOCKET_MESSAGES } from 'utils/consts';

const GameInfo = ({ players, username, roomName, endpoint, sendJsonMessage, className = null }) => {
  const handleSetReady = async () => {
    await putRoomDetailsPlayer(endpoint, roomName, username, { is_ready: true });
    sendJsonMessage(WEBSOCKET_MESSAGES.ready(username));
  };

  return (
    <div className="game-info-form">
      <h2>{roomName}</h2>
      <div className="game-info">
        {players.map((player) => (
          <div key={player.username} className="player-info">
            <div>{player.username}</div>
            {player.username === username && !player.is_ready ? (
              <button
                className={`btn ${className || ''} ready-state`}
                onClick={() => handleSetReady()}>
                Ready?
              </button>
            ) : (
              <img
                key={player.is_ready}
                className="ready-state animate-data "
                src={player.is_ready ? Ready : NotReady}
                alt="Ready state"
              />
            )}
          </div>
        ))}
      </div>
      <div className="info">
        <img src={className === 'btn-outline-dark' ? InfoBlack : InfoWhite} alt="Info" />
        Your turn depends on who first marks &ldquo;Ready?&ldquo;
      </div>
    </div>
  );
};

export default GameInfo;
