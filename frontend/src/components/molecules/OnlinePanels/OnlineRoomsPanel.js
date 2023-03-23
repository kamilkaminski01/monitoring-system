import React from 'react';
import './OnlinePanels.scss';
import { deleteAuthRoom } from 'utils/requests';
import { openMonitoringWindow } from 'utils/monitoring';

const OnlineRoomsPanel = ({ gameName, rooms, path, endpoint }) => {
  return (
    <div className="online-content-container">
      <h2>{gameName}</h2>
      {rooms.length ? (
        rooms.map((room) => (
          <div
            className="online-content"
            key={room.room_id}
            onClick={(event) => {
              openMonitoringWindow(event, path, room.room_name);
            }}>
            <p>{room.room_name}</p>
            <div
              className="close-btn"
              onClick={async (event) => {
                event.stopPropagation();
                await deleteAuthRoom(endpoint, room.room_name);
              }}>
              &times;
            </div>
          </div>
        ))
      ) : (
        <p className="no-online">No online {gameName.toLowerCase()} rooms</p>
      )}
    </div>
  );
};

export default OnlineRoomsPanel;
