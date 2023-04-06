import './WhiteboardHome.scss';
import React, { useContext, useState } from 'react';
import Input from 'components/atoms/Input/Input';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms';
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts';
import HomeButton from 'components/atoms/HomeButton';
import OnlineContent from 'components/molecules/OnlineContent/OnlineContent';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';

const WhiteboardHome = () => {
  const { username, setUsername } = useContext(UsernameContext);
  const [roomName, setRoomName] = useState('');
  const [whiteboardRooms] = useSocketRoomsAndUsers(WEBSOCKETS.whiteboardOnlineRooms);

  return (
    <div className="whiteboard-body">
      <div className="home-container">
        <div>
          <div className="whiteboard-home-wrapper">
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
            <button
              className="my-3 btn btn-light btn-home"
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
              className="my-2 btn btn-light btn-home"
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
