import React from 'react';
import { ENDPOINTS, PATHS, WEBSOCKETS } from 'utils/consts';
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers';
import './MonitoringPanelPage.scss';
import OnlineRoomsPanel from 'components/molecules/OnlineRoomsPanel/OnlineRoomsPanel';

const MonitoringPanelPage = () => {
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms);
  const [tictactoeRooms] = useSocketRoomsAndUsers(WEBSOCKETS.tictactoeOnlineRooms);

  return (
    <div className="monitoring-container">
      <OnlineRoomsPanel
        gameName="Bingo"
        rooms={bingoRooms}
        path={PATHS.monitoringBingo}
        endpoint={ENDPOINTS.monitoringBingoRoom}
      />
      <OnlineRoomsPanel
        gameName="Tic Tac Toe"
        rooms={tictactoeRooms}
        path={PATHS.monitoringTicTacToe}
        endpoint={ENDPOINTS.monitoringTicTacToeRoom}
      />
    </div>
  );
};

export default MonitoringPanelPage;
