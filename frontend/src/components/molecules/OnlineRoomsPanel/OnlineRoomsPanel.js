import { Link } from 'react-router-dom';
import './OnlineRoomsPanel.scss';

const OnlineRoomsPanel = ({ gameName, rooms, path }) => {
  const openRoomWindow = (event, roomName) => {
    event.preventDefault();
    window.open(`${path}/${roomName}`, '_blank', 'height=900,width=1435');
  };

  return (
    <div className="rooms-container">
      <h2>{gameName} Rooms</h2>
      {rooms.length ? (
        rooms.map((room) => (
          <Link
            key={room.room_id}
            id={room.room_id}
            className="online-room"
            to={`${path}/${room.room_name}`}
            onClick={(event) => {
              openRoomWindow(event, room.room_name);
            }}>
            <p>{room.room_name}</p>
          </Link>
        ))
      ) : (
        <p className="no-rooms">No online {gameName.toLowerCase()} rooms</p>
      )}
    </div>
  );
};

export default OnlineRoomsPanel;
