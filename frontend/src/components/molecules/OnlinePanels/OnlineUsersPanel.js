import React from 'react';
import './OnlinePanels.scss';
import { deleteAuthGame } from 'utils/requests';
import { openMonitoringWindow } from 'utils/monitoring';

const OnlineUsersPanel = ({ gameName, users, path, endpoint }) => {
  return (
    <div className="online-content-container">
      <h2>{gameName}</h2>
      {users.length ? (
        users.map((user) => (
          <div
            className="online-content"
            key={user.username}
            onClick={(event) => {
              openMonitoringWindow(event, path, user.username);
            }}>
            <p>{user.username}</p>
            <div
              className="close-btn"
              onClick={async (event) => {
                event.stopPropagation();
                await deleteAuthGame(endpoint, user.username);
              }}>
              &times;
            </div>
          </div>
        ))
      ) : (
        <p className="no-online">No online {gameName.toLowerCase()} users</p>
      )}
    </div>
  );
};

export default OnlineUsersPanel;
