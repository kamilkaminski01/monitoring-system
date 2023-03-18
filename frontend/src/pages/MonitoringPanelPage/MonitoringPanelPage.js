import React from 'react';
import { PATHS, WEBSOCKETS } from 'utils/consts';
import { useSocketRooms } from 'hooks/useSocketRooms';
import './MonitoringPanelPage.scss';
import OnlineRoomsPanel from 'components/molecules/OnlineRoomsPanel/OnlineRoomsPanel';

const MonitoringPanelPage = () => {
  const [bingoRooms] = useSocketRooms(WEBSOCKETS.bingoOnlineRooms);
  const [tictactoeRooms] = useSocketRooms(WEBSOCKETS.tictactoeOnlineRooms);

  return (
    <div className="monitoring-container">
      <OnlineRoomsPanel gameName="Bingo" rooms={bingoRooms} path={PATHS.monitoringBingo} />
      <OnlineRoomsPanel
        gameName="Tic Tac Toe"
        rooms={tictactoeRooms}
        path={PATHS.monitoringTicTacToe}
      />
    </div>
  );
};

export default MonitoringPanelPage;
