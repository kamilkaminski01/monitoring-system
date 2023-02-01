import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from 'utils/consts';
import Home from './pages/HomePage/Home.js';
import LoginPage from 'pages/LoginPage/LoginPage';
import SharedLayout from 'components/atoms/SharedLayout';
import ProtectedRoutes from 'components/atoms/ProtectedRoutes';
import Whiteboard from './pages/Whiteboard/Whiteboard.js';
import MonitoringPanel from './pages/MonitoringPanel/MonitoringPanel.js';
import './App.css';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<Home />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<Whiteboard />} />
        <Route element={<ProtectedRoutes />}>
          <Route element={<SharedLayout />}>
            <Route path={PATHS.monitoring} element={<MonitoringPanel />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}

export default App;
