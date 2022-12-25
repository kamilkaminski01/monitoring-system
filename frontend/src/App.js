import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { PATHS } from './utils/consts';
import Home from './components/Home/Home.js';
import Whiteboard from './components/Whiteboard/Whiteboard.js';
import './App.css';

function App() {
  return (
    <div>
      <Routes>
        <Route path={PATHS.home} element={<Home />} />
        <Route path={PATHS.whiteboard} element={<Whiteboard />} />
        <Route path={PATHS.bingo} />
        <Route path={PATHS.tictactoe} />
      </Routes>
    </div>
  );
}

export default App;
