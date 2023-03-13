import { useContext } from 'react';
import { UsernameContext } from 'providers/UsernameContextProvider';
import './OnlineRooms.scss';
import { ENDPOINTS } from 'utils/consts';
import { checkRoomLimit, redirectToRoom } from 'utils/handleRooms';
import { roomDetails } from 'utils/roomDetails';
import { swalCornerError } from 'utils/swal';

const OnlineRooms = ({ rooms, path }) => {
  const { username, isUsernameSet } = useContext(UsernameContext);
  const detailsEndpoint = path.includes('bingo')
    ? ENDPOINTS.detailsBingoRoom
    : ENDPOINTS.detailsTicTacToeRoom;

  const handleLinkClick = async (roomName) => {
    const room = await roomDetails(detailsEndpoint, roomName, true);
    const player = room.players.find((player) => player.username === username);
    if (player) {
      if (!player.is_active) {
        return redirectToRoom(roomName);
      } else {
        return swalCornerError('Username error', 'Username is taken');
      }
    }
    if (!(await checkRoomLimit(detailsEndpoint, roomName))) {
      return;
    }
    redirectToRoom(roomName);
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
