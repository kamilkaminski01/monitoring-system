import React from "react";
import { Route, Routes } from "react-router-dom";
import { PATHS } from "./utils/consts";
import Home from "./components/Home";
import Whiteboard from "./components/Whiteboard";
import "./components/css/App.css";

function App() {
  return (
    <div>
      <Routes>
        <Route path={PATHS.home} element={<Home />} />
        <Route path={PATHS.whiteboard} element={<Whiteboard />} />
      </Routes>
    </div>
  );
}

export default App;
