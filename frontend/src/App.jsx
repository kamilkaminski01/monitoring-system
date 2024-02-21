import './App.scss'
import { Route, Routes } from 'react-router-dom'
import { PATHS } from 'utils/consts'
import HomePage from './pages/HomePage'
import BingoHome from 'apps/Bingo/Home'
import Bingo from 'apps/Bingo/Game'
import TicTacToeHome from 'apps/TicTacToe/Home'
import TicTacToe from 'apps/TicTacToe/Game'
import LoginPage from 'pages/LoginPage'
import SharedLayout from 'components/atoms/SharedLayout'
import ProtectedRoutes from 'components/atoms/ProtectedRoutes'
import MonitoringPage from './pages/MonitoringPage'
import BingoMonitoring from 'apps/Bingo/Monitoring'
import TicTacToeMonitoring from 'apps/TicTacToe/Monitoring'
import FifteenHome from 'apps/Fifteen/Home'
import Fifteen from 'apps/Fifteen/Game'
import FifteenMonitoring from 'apps/Fifteen/Monitoring'
import WhiteboardHome from 'apps/Whiteboard/Home'
import Whiteboard from 'apps/Whiteboard/Game'

function App() {
  return (
    <div className="app">
      <Routes>
        <Route path={PATHS.login} element={<LoginPage />} />
        <Route element={<SharedLayout />}>
          <Route path={PATHS.home} element={<HomePage />} />
        </Route>
        <Route path={PATHS.whiteboard} element={<WhiteboardHome />} />
        <Route path={PATHS.whiteboardRoom} element={<Whiteboard />} />

        <Route path={PATHS.fifteen} element={<FifteenHome />} />
        <Route path={PATHS.fifteenUser} element={<Fifteen />} />

        <Route path={PATHS.tictactoe} element={<TicTacToeHome />} />
        <Route path={PATHS.tictactoeRoom} element={<TicTacToe />} />

        <Route path={PATHS.bingo} element={<BingoHome />} />
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
