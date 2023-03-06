import React, { useContext, useState } from 'react';
import './TicTacToeHome.scss';
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms';
import { ENDPOINTS, PATHS, WEBSOCKETS } from 'utils/consts';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { useSocketRooms } from 'hooks/useSocketRooms';
import Input from 'components/atoms/Input/Input';
import HomeButton from 'components/atoms/HomeButton';
import OnlineRooms from 'components/molecules/OnlineRooms/OnlineRooms';

const TicTacToeHome = () => {
  const { username, setUsername } = useContext(UsernameContext);
  const [roomName, setRoomName] = useState('');
  const [tictactoeRooms] = useSocketRooms(WEBSOCKETS.tictactoeOnlineRooms);

  return (
    <div className="tictactoe-body">
      <div className="home-container">
        <div>
          <div>
            <h2>Tic Tac Toe</h2>
            <Input
              placeholder={'Your username'}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              placeholder={'Room name'}
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
            />
            <button
              className="my-2 btn btn-light btn-home"
              onClick={() =>
                handleCreateRoom(
                  ENDPOINTS.checkTicTacToeRoom,
                  ENDPOINTS.createTicTacToeRoom,
                  username,
                  roomName
                )
              }>
              Create Room
            </button>
            <button
              className="my-2 btn btn-light btn-home"
              disabled={!roomName}
              onClick={() =>
                handleJoinRoom(
                  ENDPOINTS.checkTicTacToeRoom,
                  ENDPOINTS.detailsTicTacToeRoom,
                  ENDPOINTS.createTicTacToeRoom,
                  username,
                  roomName
                )
              }>
              Join Room
            </button>
            <HomeButton className="btn-light" />
          </div>
          <OnlineRooms rooms={tictactoeRooms} path={PATHS.tictactoe} />
        </div>
      </div>
    </div>
  );
};

export default TicTacToeHome;
