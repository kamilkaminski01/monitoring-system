import React, { useContext, useState } from 'react';
import './TicTacToeHome.scss';
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms';
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import Input from 'components/atoms/Input/Input';
import HomeButton from 'components/atoms/HomeButton/HomeButton';
import OnlineContent from 'components/molecules/OnlineContent/OnlineContent';

const TicTacToeHome = () => {
  const { username, setUsername } = useContext(UsernameContext);
  const [roomName, setRoomName] = useState('');
  const [tictactoeRooms] = useSocketRoomsAndUsers(WEBSOCKETS.tictactoeOnlineRooms);

  return (
    <div className="tictactoe-body">
      <div className="game-home-container">
        <div className="game-home-content">
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
            <div className="room-options">
              <button
                className="btn btn-light"
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
                className="btn btn-light"
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
            </div>
            <HomeButton className="btn-light" />
          </div>
          <OnlineContent content={tictactoeRooms} type={GAME_TYPE.rooms} />
        </div>
      </div>
    </div>
  );
};

export default TicTacToeHome;
