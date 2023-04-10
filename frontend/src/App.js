import React from 'react';
import './App.scss';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from 'utils/consts';
import HomePage from './pages/HomePage/HomePage';
import BingoHome from 'apps/Bingo/BingoHome';
import Bingo from 'apps/Bingo/Bingo';
import TicTacToeHome from 'apps/TicTacToe/TicTacToeHome';
import TicTacToe from 'apps/TicTacToe/TicTacToe';
import LoginForm from 'components/molecules/LoginForm/LoginForm';
import SharedLayout from 'components/atoms/SharedLayout/SharedLayout';
import ProtectedRoutes from './components/atoms/ProtectedRoutes';
import MonitoringPanelPage from './pages/MonitoringPanelPage/MonitoringPanelPage';
import BingoMonitoring from 'apps/Bingo/BingoMonitoring';
import TicTacToeMonitoring from 'apps/TicTacToe/TicTacToeMonitoring';
import FifteenHome from 'apps/Fifteen/FifteenHome';
import Fifteen from 'apps/Fifteen/Fifteen';
import FifteenMonitoring from 'apps/Fifteen/FifteenMonitoring';
import WhiteboardHome from 'apps/Whiteboard/WhiteboardHome';
import Whiteboard from './apps/Whiteboard/Whiteboard';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={PATHS.login} element={<LoginForm />} />
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<WhiteboardHome />} />
        <Route path={`${PATHS.whiteboard}/:roomName`} element={<Whiteboard />} />

        <Route path={PATHS.bingo} element={<BingoHome />} />
        <Route path={`${PATHS.bingo}/:roomName`} element={<Bingo />} />

        <Route path={PATHS.tictactoe} element={<TicTacToeHome />} />
        <Route path={`${PATHS.tictactoe}/:roomName`} element={<TicTacToe />} />

        <Route path={PATHS.fifteen} element={<FifteenHome />} />
        <Route path={`${PATHS.fifteen}/:username`} element={<Fifteen />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<SharedLayout />}>
            <Route path={PATHS.monitoring} element={<MonitoringPanelPage />} />
          </Route>
          <Route path={`${PATHS.monitoringBingo}/:roomName`} element={<BingoMonitoring />} />
          <Route
            path={`${PATHS.monitoringTicTacToe}/:roomName`}
            element={<TicTacToeMonitoring />}
          />
          <Route path={`${PATHS.monitoringFifteen}/:userName`} element={<FifteenMonitoring />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
