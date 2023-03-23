import React, { useContext } from 'react';
import './FifteenHome.scss';
import { UsernameContext } from 'providers/UsernameContextProvider';
import Input from 'components/atoms/Input/Input';
import HomeButton from 'components/atoms/HomeButton';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import { ENDPOINTS, WEBSOCKETS } from 'utils/consts';
import { handleCreateGame } from 'utils/handleRooms';
import OnlineUsers from 'components/molecules/OnlineUsers/OnlineUsers';

const FifteenHome = () => {
  const { username, setUsername } = useContext(UsernameContext);
  const [, users] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers);

  return (
    <div className="fifteen-body">
      <div className="home-container">
        <div>
          <h2 className="my-3 text-center">Fifteen Puzzle</h2>
          <Input
            placeholder={'Your username'}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <div className="home-buttons">
            <button
              className="my-3 btn btn-outline-primary btn-home"
              disabled={!username}
              onClick={() =>
                handleCreateGame(
                  ENDPOINTS.checkFifteenPuzzle,
                  ENDPOINTS.createFifteenPuzzle,
                  username
                )
              }>
              Start
            </button>
            <HomeButton className="btn-outline-primary" />
          </div>
          <OnlineUsers users={users} />
        </div>
      </div>
    </div>
  );
};

export default FifteenHome;
