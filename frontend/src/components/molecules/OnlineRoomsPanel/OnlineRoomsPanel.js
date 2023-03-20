import React from 'react';
import { Link } from 'react-router-dom';
import './OnlineRoomsPanel.scss';
import { deleteAuthRoom } from 'utils/roomDetails';

const OnlineRoomsPanel = ({ gameName, rooms, path, endpoint }) => {
  const openRoomWindow = (event, roomName) => {
    event.preventDefault();
    window.open(`${path}/${roomName}`, '_blank', 'height=900,width=1435');
  };

  return (
    <div className="rooms-container">
      <h2>{gameName} Rooms</h2>
      {rooms.length ? (
        rooms.map((room) => (
          <div
            className="online-room"
            key={room.room_id}
            onClick={(event) => {
              openRoomWindow(event, room.room_name);
            }}>
            <Link
              id={room.room_id}
              to={`${path}/${room.room_name}`}
              onClick={(event) => {
                openRoomWindow(event, room.room_name);
              }}>
              <p>{room.room_name}</p>
            </Link>
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
        <p className="no-rooms">No online {gameName.toLowerCase()} rooms</p>
      )}
    </div>
  );
};

export default OnlineRoomsPanel;
