import './style.scss'
import useUsername from 'hooks/useUsername'
import { useParams } from 'react-router-dom'
import { ENDPOINTS, LOCAL_STORAGE, WEBSOCKETS } from 'utils/consts'
import MonitoringChat from 'components/molecules/MonitoringChat'
import { useFifteenMonitoringData } from 'hooks/useFifteenMonitoringData'
import useWebSocket from 'react-use-websocket'
import MonitoringGameInfo from 'components/molecules/MonitoringGameInfo'
import { getAuthGameDetails } from 'utils/requests'
import GameLayout from 'components/atoms/GameLayout'

const FifteenMonitoring = () => {
  const { userName } = useParams()
  const username = useUsername()
  const detailsEndpoint = ENDPOINTS.monitoringFifteenPuzzle
  const websocket = `${WEBSOCKETS.fifteen}/${userName}/?token=${localStorage.getItem(
    LOCAL_STORAGE.accessToken
  )}`
  const { puzzleState, gameState, moves, setPuzzleState, setGameState, setMoves } =
    useFifteenMonitoringData(detailsEndpoint, userName)

  useWebSocket(websocket, {
    onOpen: () => {},
    onMessage: (message) => {
      const data = JSON.parse(message.data)
      const command = data.command
      if (command === 'click') {
        setPuzzleState(data.value)
        setMoves(moves + 1)
      } else if (command === 'win') {
        setGameState(false)
      } else if (command === 'restart') {
        getAuthGameDetails(detailsEndpoint, userName).then((data) => {
          setPuzzleState(data.board_state)
          setGameState(data.game_state)
          setMoves(data.moves)
        })
      } else if (command === 'leave') {
        window.close()
      }
    }
  })

  return (
    <GameLayout className="fifteen monitoring">
      <div className="fifteen__monitoring">
        <MonitoringGameInfo roomName={userName} gameState={gameState} moves={moves} />
        <div className="fifteen__game animation--fade-in">
          <div className="fifteen__game-grid">
            {puzzleState.map((row) =>
              row.map((value) => (
                <div key={value} className="grid__tile">
                  {value}
                </div>
              ))
            )}
          </div>
        </div>
        <MonitoringChat websocket={websocket} username={username} />
      </div>
    </GameLayout>
  )
}

export default FifteenMonitoring
