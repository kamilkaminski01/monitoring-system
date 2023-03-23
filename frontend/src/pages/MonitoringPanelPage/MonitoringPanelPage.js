import React from 'react';
import { ENDPOINTS, PATHS, WEBSOCKETS } from 'utils/consts';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import './MonitoringPanelPage.scss';
import OnlineRoomsPanel from 'components/molecules/OnlinePanels/OnlineRoomsPanel';
import OnlineUsersPanel from 'components/molecules/OnlinePanels/OnlineUsersPanel';

const MonitoringPanelPage = () => {
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms);
  const [tictactoeRooms] = useSocketRoomsAndUsers(WEBSOCKETS.tictactoeOnlineRooms);
  const [, fifteenUsers] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers);

  return (
    <div className="monitoring-container">
      <OnlineUsersPanel
        gameName="Fifteen Puzzle"
        users={fifteenUsers}
        path={PATHS.monitoringFifteen}
        endpoint={ENDPOINTS.monitoringFifteenPuzzle}
      />
      <OnlineRoomsPanel
        gameName="Tic Tac Toe"
        rooms={tictactoeRooms}
        path={PATHS.monitoringTicTacToe}
        endpoint={ENDPOINTS.monitoringTicTacToeRoom}
      />
      <OnlineRoomsPanel
        gameName="Bingo"
        rooms={bingoRooms}
        path={PATHS.monitoringBingo}
        endpoint={ENDPOINTS.monitoringBingoRoom}
      />
    </div>
  );
};

export default MonitoringPanelPage;
