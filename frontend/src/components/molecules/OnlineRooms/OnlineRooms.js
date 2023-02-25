import { Link } from 'react-router-dom';
import './OnlineRooms.scss';

const OnlineRooms = ({ rooms, path }) => {
  return (
    <div className="my-3">
      <h4>Online Rooms:</h4>
      <div className="online-rooms">
        {rooms.length ? (
          rooms.map((room) => (
            <Link
              key={room.room_id}
              id={room.room_id}
              className="room"
              to={`${path}/${room.room_name}`}>
              <p>{room.room_name}</p>
            </Link>
          ))
        ) : (
          <p className="room">No online rooms</p>
        )}
      </div>
    </div>
  );
};

export default OnlineRooms;
