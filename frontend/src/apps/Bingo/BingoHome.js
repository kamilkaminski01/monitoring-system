import React, { useContext, useState } from 'react';
import { ENDPOINTS, PATHS, WEBSOCKETS } from 'utils/consts';
import './BingoHome.scss';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import Checkbox from 'components/atoms/Checkbox/Checkbox';
import Input from 'components/atoms/Input/Input';
import HomeButton from 'components/atoms/HomeButton';
import OnlineRooms from 'components/molecules/OnlineRooms/OnlineRooms';

const BingoHome = () => {
  const { username, setUsername } = useContext(UsernameContext);
  const [roomName, setRoomName] = useState('');
  const [playersLimit, setPlayersLimit] = useState('');
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms);

  return (
    <div className="bingo-body">
      <div className="home-container">
        <div>
          <div>
            <h2>Bingo</h2>
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
            <button className="my-3 btn btn-success btn-home" onClick={() => setIsPopupOpen(true)}>
              Create Room
            </button>
            <button
              className="my-2 btn btn-success btn-home"
              disabled={!roomName}
              onClick={() =>
                handleJoinRoom(
                  ENDPOINTS.checkBingoRoom,
                  ENDPOINTS.detailsBingoRoom,
                  ENDPOINTS.createBingoRoom,
                  username,
                  roomName
                )
              }>
              Join Room
            </button>
            <HomeButton className="btn-success" />
          </div>
          <OnlineRooms rooms={bingoRooms} path={PATHS.bingo} />
        </div>
      </div>
      <div className={`popup ${isPopupOpen ? 'active' : ''}`}>
        <div className="close-btn" onClick={() => setIsPopupOpen(false)}>
          &times;
        </div>
        <div className="form">
          <h2>Players Limit</h2>
          <Checkbox
            value="2"
            checked={playersLimit === 2}
            onChange={(event) => setPlayersLimit(parseInt(event.target.value))}
          />
          <Checkbox
            value="3"
            checked={playersLimit === 3}
            onChange={(event) => setPlayersLimit(parseInt(event.target.value))}
          />
          <Checkbox
            value="4"
            checked={playersLimit === 4}
            onChange={(event) => setPlayersLimit(parseInt(event.target.value))}
          />
          <button
            onClick={() =>
              handleCreateRoom(
                ENDPOINTS.checkBingoRoom,
                ENDPOINTS.createBingoRoom,
                username,
                roomName,
                playersLimit
              )
            }>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default BingoHome;
