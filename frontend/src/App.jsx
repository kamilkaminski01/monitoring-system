import './App.scss'
import { Route, Routes } from 'react-router-dom'
import { PATHS } from 'utils/consts'
import HomePage from './pages/HomePage'
import BingoMenu from 'apps/Bingo/Menu'
import Bingo from 'apps/Bingo/Game'
import TicTacToeMenu from 'apps/TicTacToe/Menu'
import TicTacToe from 'apps/TicTacToe/Game'
import LoginPage from 'pages/LoginPage'
import SharedLayout from 'components/atoms/SharedLayout'
import ProtectedRoutes from 'components/atoms/ProtectedRoutes'
import MonitoringPage from './pages/MonitoringPage'
import BingoMonitoring from 'apps/Bingo/Monitoring'
import TicTacToeMonitoring from 'apps/TicTacToe/Monitoring'
import FifteenMenu from 'apps/Fifteen/Menu'
import Fifteen from 'apps/Fifteen/Game'
import FifteenMonitoring from 'apps/Fifteen/Monitoring'
import WhiteboardMenu from 'apps/Whiteboard/Menu'
import Whiteboard from 'apps/Whiteboard/Game'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<WhiteboardMenu />} />
        <Route path={PATHS.whiteboardRoom} element={<Whiteboard />} />

        <Route path={PATHS.fifteen} element={<FifteenMenu />} />
        <Route path={PATHS.fifteenUser} element={<Fifteen />} />

        <Route path={PATHS.tictactoe} element={<TicTacToeMenu />} />
        <Route path={PATHS.tictactoeRoom} element={<TicTacToe />} />

        <Route path={PATHS.bingo} element={<BingoMenu />} />
        <Route path={PATHS.bingoRoom} element={<Bingo />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<SharedLayout />}>
            <Route path={PATHS.monitoring} element={<MonitoringPage />} />
          </Route>
          <Route path={PATHS.monitoringFifteenUser} element={<FifteenMonitoring />} />
          <Route path={PATHS.monitoringTicTacToeRoom} element={<TicTacToeMonitoring />} />
          <Route path={PATHS.monitoringBingoRoom} element={<BingoMonitoring />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
