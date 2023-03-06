import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UsernameContext } from 'providers/UsernameContextProvider';
import './OnlineRooms.scss';

const OnlineRooms = ({ rooms, path }) => {
  const { isUsernameSet } = useContext(UsernameContext);

  return (
    <div className="my-3">
      <h4>Online Rooms:</h4>
      <div className="online-rooms">
        {rooms.length ? (
          rooms.map((room) =>
            isUsernameSet ? (
              <Link
                key={room.room_id}
                id={room.room_id}
                className="room"
                to={`${path}/${room.room_name}`}>
                <p>{room.room_name}</p>
              </Link>
            ) : (
              <p key={room.room_id} className="room">
                {room.room_name}
              </p>
            )
          )
        ) : (
          <p className="room">No online rooms</p>
        )}
      </div>
    </div>
  );
};

export default OnlineRooms;
