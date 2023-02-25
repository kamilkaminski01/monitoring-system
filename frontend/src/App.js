import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from 'utils/consts';
import HomePage from './pages/HomePage/HomePage';
import BingoHomePage from 'pages/BingoHomePage/BingoHomePage';
import TicTacToeHomePage from 'pages/TicTacToeHomePage/TicTacToeHomePage';
import LoginForm from 'components/molecules/LoginForm/LoginForm';
import SharedLayout from './components/atoms/SharedLayout';
import ProtectedRoutes from './components/atoms/ProtectedRoutes';
import Whiteboard from './apps/Whiteboard/Whiteboard';
import MonitoringPanelPage from './pages/MonitoringPanelPage/MonitoringPanelPage';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={PATHS.login} element={<LoginForm />} />
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<Whiteboard />} />
        <Route path={PATHS.bingo} element={<BingoHomePage />} />
        <Route path={PATHS.tictactoe} element={<TicTacToeHomePage />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<SharedLayout />}>
            <Route path={PATHS.monitoring} element={<MonitoringPanelPage />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
