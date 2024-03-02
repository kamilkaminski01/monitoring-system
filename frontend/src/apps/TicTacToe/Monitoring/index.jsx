import './style.scss'
import { ENDPOINTS, LOCAL_STORAGE, WEBSOCKETS } from 'utils/consts'
import { useParams } from 'react-router-dom'
import { useTicTacToeMonitoringData } from 'hooks/useTicTacToeMonitoringData'
import useUsername from 'hooks/useUsername'
import useWebSocket from 'react-use-websocket'
import { getAuthRoomDetails } from 'utils/requests'
import MonitoringGameInfo from 'components/molecules/MonitoringGameInfo'
import MonitoringPlayerInfo from 'components/molecules/MonitoringPlayerInfo'
import MonitoringChat from 'components/molecules/MonitoringChat'
import GameLayout from 'components/atoms/GameLayout'

const TicTacToeMonitoring = () => {
  const { roomName } = useParams()
  const username = useUsername()
  const detailsRoomEndpoint = ENDPOINTS.monitoringTicTacToeRoom
  const websocket = `${WEBSOCKETS.tictactoe}/${roomName}/?token=${localStorage.getItem(
    LOCAL_STORAGE.accessToken
  )}`
  const {
    roomPlayers,
    gameState,
    totalPlayers,
    playersTurn,
    boardState,
    setRoomPlayers,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState
  } = useTicTacToeMonitoringData(detailsRoomEndpoint, roomName)

  useWebSocket(websocket, {
    onOpen: () => {},
    onMessage: (message) => {
      const data = JSON.parse(message.data)
      const command = data.command
      if (command !== 'message') {
        setTimeout(() => {
          getAuthRoomDetails(detailsRoomEndpoint, roomName)
            .then((data) => {
              const playersData = data.players.map((player) => {
                return {
                  username: player.username,
                  isActive: player.is_active,
                  isWinner: player.is_winner,
                  isReady: player.is_ready,
                  figure: player.figure
                }
              })
              setRoomPlayers(playersData)
              setTotalPlayers(data.total_players)
              setPlayersTurn(data.players_turn)
              setBoardState(data.board_state)
              setGameState(data.game_state)
            })
            .catch(() => {
              window.close()
            })
        }, 50)
      }
      if (command === 'click' && command !== 'restart') {
        setBoardState(data.value)
      }
    }
  })

  const boardElements = boardState.map((value, index) => (
    <div key={index} id={index} className="game-grid__tile">
      {value}
    </div>
  ))

  return (
    <GameLayout className="tictactoe monitoring">
      <MonitoringGameInfo
        roomName={roomName}
        gameState={gameState}
        totalPlayers={totalPlayers}
        playersTurn={playersTurn}
      />
      <div className="tictactoe__monitoring">
        <div className="tictactoe__game">
          <div className="monitoring__players-info">
            {roomPlayers.map((player) => (
              <MonitoringPlayerInfo key={player.username} player={player} />
            ))}
          </div>
          <div className="tictactoe__game-grid">{boardElements}</div>
        </div>
      </div>
      <MonitoringChat websocket={websocket} username={username} />
    </GameLayout>
  )
}

export default TicTacToeMonitoring
