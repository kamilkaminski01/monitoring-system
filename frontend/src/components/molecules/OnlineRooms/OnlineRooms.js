import { useContext } from 'react';
import { UsernameContext } from 'providers/UsernameContextProvider';
import './OnlineRooms.scss';
import { ENDPOINTS } from 'utils/consts';
import { checkRoomLimit } from 'utils/handleRooms';

const OnlineRooms = ({ rooms, path }) => {
  const { isUsernameSet } = useContext(UsernameContext);
  const detailsEndpoint = path.includes('bingo')
    ? ENDPOINTS.detailsBingoRoom
    : ENDPOINTS.detailsTicTacToeRoom;

  const handleLinkClick = async (roomName) => {
    if (await checkRoomLimit(detailsEndpoint, roomName))
      window.location.href = `${path}/${roomName}`;
  };

  return (
    <div className="my-3">
      <h4>Online Rooms:</h4>
      <div className="online-rooms">
        {rooms.length ? (
          rooms.map((room) =>
            isUsernameSet ? (
              <p
                key={room.room_id}
                id={room.room_id}
                className="room"
                onClick={() => handleLinkClick(room.room_name)}>
                {room.room_name}
              </p>
            ) : (
              <p key={room.room_id} className="room no-link">
                {room.room_name}
              </p>
            )
          )
        ) : (
          <p className="room no-link">No online rooms</p>
        )}
      </div>
    </div>
  );
};

export default OnlineRooms;
