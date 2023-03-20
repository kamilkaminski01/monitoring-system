import React from 'react';
import { ENDPOINTS, PATHS, WEBSOCKETS } from 'utils/consts';
import { useSocketRooms } from 'hooks/useSocketRooms';
import './MonitoringPanelPage.scss';
import OnlineRoomsPanel from 'components/molecules/OnlineRoomsPanel/OnlineRoomsPanel';

const MonitoringPanelPage = () => {
  const [bingoRooms] = useSocketRooms(WEBSOCKETS.bingoOnlineRooms);
  const [tictactoeRooms] = useSocketRooms(WEBSOCKETS.tictactoeOnlineRooms);

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
