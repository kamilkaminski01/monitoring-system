import { ENDPOINTS, GAME_TYPE, PATHS, WEBSOCKETS } from 'utils/consts'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import './style.scss'
import Panel from './components/Panel'

const MonitoringPage = () => {
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms)
  const [tictactoeRooms] = useSocketRoomsAndUsers(WEBSOCKETS.tictactoeOnlineRooms)
  const [, fifteenUsers] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers)
  const [whiteboards] = useSocketRoomsAndUsers(WEBSOCKETS.whiteboardOnlineRooms)

  return (
    <div className="monitoring-page">
      <Panel
        gameName="Whiteboard"
        items={whiteboards}
        path={PATHS.whiteboard}
        endpoint={ENDPOINTS.monitoringWhiteboard}
        panelType={GAME_TYPE.rooms}
        panelTypeName={'whiteboards'}
      />
      <Panel
        gameName="Fifteen Puzzle"
        items={fifteenUsers}
        path={PATHS.monitoringFifteen}
        endpoint={ENDPOINTS.monitoringFifteenPuzzle}
        panelType={GAME_TYPE.users}
      />
      <Panel
        gameName="Tic Tac Toe"
        items={tictactoeRooms}
        path={PATHS.monitoringTicTacToe}
        endpoint={ENDPOINTS.monitoringTicTacToeRoom}
        panelType={GAME_TYPE.rooms}
      />
      <Panel
        gameName="Bingo"
        items={bingoRooms}
        path={PATHS.monitoringBingo}
        endpoint={ENDPOINTS.monitoringBingoRoom}
        panelType={GAME_TYPE.rooms}
      />
    </div>
  )
}

export default MonitoringPage
