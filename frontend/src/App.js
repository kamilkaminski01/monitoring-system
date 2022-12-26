import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from './utils/consts';
import Home from './pages/HomePage/Home.js';
import SharedLayout from './components/atoms/SharedLayout/SharedLayout';
import Whiteboard from './pages/Whiteboard/Whiteboard.js';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<Home />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<Whiteboard />} />
      </Routes>
    </div>
  );
}

export default App;
