import React, { useContext } from 'react';
import './FifteenHome.scss';
import { UsernameContext } from 'providers/UsernameContextProvider';
import Input from 'components/atoms/Input/Input';
import HomeButton from 'components/atoms/HomeButton/HomeButton';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts';
import { handleCreateGame } from 'utils/handleRooms';
import OnlineContent from 'components/molecules/OnlineContent/OnlineContent';

const FifteenHome = () => {
  const { username, setUsername } = useContext(UsernameContext);
  const [, users] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers);

  return (
    <div className="fifteen-body">
      <div className="home-container">
        <div className="home-content">
          <h2 className="my-3 text-center">Fifteen Puzzle</h2>
          <Input
            placeholder={'Your username'}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button
            className="my-3 btn btn-outline-primary"
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
          <OnlineContent content={users} type={GAME_TYPE.users} />
        </div>
      </div>
    </div>
  );
};

export default FifteenHome;
