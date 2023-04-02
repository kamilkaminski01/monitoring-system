import React from 'react';
import { ENDPOINTS, GAME_TYPE, PATHS, WEBSOCKETS } from 'utils/consts';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import './MonitoringPanelPage.scss';
import OnlinePanel from 'components/molecules/OnlinePanel/OnlinePanel';

const MonitoringPanelPage = () => {
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms);
  const [tictactoeRooms] = useSocketRoomsAndUsers(WEBSOCKETS.tictactoeOnlineRooms);
  const [, fifteenUsers] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers);

  return (
    <div className="monitoring-container">
      <OnlinePanel
        gameName="Fifteen Puzzle"
        items={fifteenUsers}
        path={PATHS.monitoringFifteen}
        endpoint={ENDPOINTS.monitoringFifteenPuzzle}
        panelType={GAME_TYPE.users}
      />
      <OnlinePanel
        gameName="Tic Tac Toe"
        items={tictactoeRooms}
        path={PATHS.monitoringTicTacToe}
        endpoint={ENDPOINTS.monitoringTicTacToeRoom}
        panelType={GAME_TYPE.rooms}
      />
      <OnlinePanel
        gameName="Bingo"
        items={bingoRooms}
        path={PATHS.monitoringBingo}
        endpoint={ENDPOINTS.monitoringBingoRoom}
        panelType={GAME_TYPE.rooms}
      />
    </div>
  );
};

export default MonitoringPanelPage;
