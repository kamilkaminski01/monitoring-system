import './WhiteboardHome.scss';
import React, { useContext, useState } from 'react';
import Input from 'components/atoms/Input/Input';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms';
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts';
import HomeButton from 'components/atoms/HomeButton/HomeButton';
import OnlineContent from 'components/molecules/OnlineContent/OnlineContent';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import { AuthContext } from 'providers/AuthContextProvider';

const WhiteboardHome = () => {
  const { isLogged } = useContext(AuthContext);
  const { username, setUsername } = useContext(UsernameContext);
  const [roomName, setRoomName] = useState('');
  const [whiteboardRooms] = useSocketRoomsAndUsers(WEBSOCKETS.whiteboardOnlineRooms);

  return (
    <div className="whiteboard-body">
      <div className="game-home-container">
        <div className="game-home-content">
          <div>
            <h2>Whiteboard</h2>
            <Input
              placeholder={'Your username'}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              placeholder={'Whiteboard name'}
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
            />
            <div className="room-options">
              <button
                className="btn btn-light"
                disabled={isLogged}
                onClick={() =>
                  handleCreateRoom(
                    ENDPOINTS.checkWhiteboard,
                    ENDPOINTS.createWhiteboard,
                    username,
                    roomName
                  )
                }>
                Create whiteboard
              </button>
              <button
                className="btn btn-light"
                disabled={!roomName}
                onClick={() =>
                  handleJoinRoom(
                    ENDPOINTS.checkWhiteboard,
                    ENDPOINTS.detailsWhiteboard,
                    ENDPOINTS.createWhiteboard,
                    username,
                    roomName
                  )
                }>
                Join whiteboard
              </button>
            </div>
            <HomeButton className="btn-light" />
          </div>
          <OnlineContent
            content={whiteboardRooms}
            type={GAME_TYPE.rooms}
            typeName={'whiteboards'}
          />
        </div>
      </div>
    </div>
  );
};

export default WhiteboardHome;
