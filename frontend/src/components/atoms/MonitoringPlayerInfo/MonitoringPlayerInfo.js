import React from 'react';
import './MonitoringPlayerInfo.scss';
import Checkmark from 'assets/icons/checkmark.svg';
import Cancel from 'assets/icons/cancel.svg';

const MonitoringPlayerInfo = ({ player }) => {
  return (
    <div className="monitoring-info">
      <div className="monitoring-data player-data">
        <h4>{player.username}</h4>
        <div>
          Active:
          <img
            key={player.isActive}
            src={player.isActive ? Checkmark : Cancel}
            alt="Is active"
            className="animate-data"
          />
        </div>
        <div>
          Winner:
          <img
            key={player.isWinner}
            src={player.isWinner ? Checkmark : Cancel}
            alt="Is winner"
            className="animate-data"
          />
        </div>
        <div>
          Ready:
          <img
            key={player.isReady}
            src={player.isReady ? Checkmark : Cancel}
            alt="Is ready"
            className="animate-data"
          />
        </div>
        {player.figure && (
          <div>
            Figure:
            <div key={player.figure} className="animate-data">
              {player.figure}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MonitoringPlayerInfo;
