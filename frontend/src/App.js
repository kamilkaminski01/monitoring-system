import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from 'utils/consts';
import HomePage from './pages/HomePage/HomePage.js';
import LoginPage from './pages/LoginPage/LoginPage';
import SharedLayout from './components/atoms/SharedLayout';
import ProtectedRoutes from './components/atoms/ProtectedRoutes';
import Whiteboard from './pages/WhiteboardPage/Whiteboard.js';
import MonitoringPanelPage from './pages/MonitoringPanelPage/MonitoringPanelPage.js';
import './App.scss';

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<Whiteboard />} />
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
