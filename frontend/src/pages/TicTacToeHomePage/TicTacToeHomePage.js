import React from 'react';
import './TicTacToeHomePage.scss';
import { handleCreateRoom, handleJoinRoom } from 'utils/Rooms/handleRooms';
import { ENDPOINTS, PATHS, WEBSOCKETS } from 'utils/consts';
import { useSocketRooms } from 'hooks/useSocketRooms';
import { useHomeData } from 'hooks/useHomeData';
import Input from 'components/atoms/Input/Input';
import HomeButton from 'components/atoms/HomeButton';
import OnlineRooms from 'components/molecules/OnlineRooms/OnlineRooms';

const TicTacToeHomePage = () => {
  const { username, setUsername, roomName, setRoomName } = useHomeData('', '');
  const [tictactoeRooms] = useSocketRooms(WEBSOCKETS.tictactoeOnlineRooms);

  return (
    <div className="tictactoe-body">
      <div className="home-container">
        <div>
          <div>
            <h2>Tic Tac Toe</h2>
            <Input value={username} onChange={(e) => setUsername(e.target.value)} />
            <Input value={roomName} onChange={(e) => setRoomName(e.target.value)} />
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
              onClick={() => handleJoinRoom(ENDPOINTS.checkTicTacToeRoom, username, roomName)}>
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

export default TicTacToeHomePage;
