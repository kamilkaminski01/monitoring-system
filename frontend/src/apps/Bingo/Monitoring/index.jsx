import './style.scss'
import { useParams } from 'react-router-dom'
import useUsername from 'hooks/useUsername'
import { ENDPOINTS, LOCAL_STORAGE, WEBSOCKETS } from 'utils/consts'
import useWebSocket from 'react-use-websocket'
import { getAuthRoomDetails } from 'utils/requests'
import { useBingoMonitoringData } from 'hooks/useBingoMonitoringData'
import { getBoardStateIndexes, highlightBingo } from 'utils/boards'
import MonitoringGameInfo from 'components/atoms/MonitoringRoomInfo'
import MonitoringPlayerInfo from 'components/atoms/MonitoringPlayerInfo'
import MonitoringChat from 'components/atoms/MonitoringChat'

const BingoMonitoring = () => {
  const { roomName } = useParams()
  const username = useUsername()
  const detailsRoomEndpoint = ENDPOINTS.monitoringBingoRoom
  const websocket = `${WEBSOCKETS.bingo}/${roomName}/?token=${localStorage.getItem(
    LOCAL_STORAGE.accessToken
  )}`
  const {
    roomPlayers,
    gameState,
    totalPlayers,
    playersTurn,
    boardState,
    playersLimit,
    setRoomPlayers,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState
  } = useBingoMonitoringData(detailsRoomEndpoint, roomName)

  useWebSocket(websocket, {
    onOpen: () => {
      roomPlayers.forEach((player) => {
        checkBingo(boardState, player)
      })
    },
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
                  bingoState: player.bingo_state,
                  initialBoardState: player.initial_board_state
                }
              })
              setRoomPlayers(playersData)
              setTotalPlayers(data.total_players)
              setPlayersTurn(data.players_turn)
              setGameState(data.game_state)
            })
            .catch(() => {
              window.close()
            })
        }, 50)
      }
      if (command === 'click') {
        const updatedBoardState = [...boardState, data.value]
        setBoardState(updatedBoardState)
        roomPlayers.forEach((player) => {
          checkBingo(updatedBoardState, player)
        })
      } else if (command === 'restart') {
        setBoardState([])
      }
    }
  })

  const checkBingo = (boardState, player) => {
    const boardStateIndexes = getBoardStateIndexes(boardState, player.initialBoardState)
    highlightBingo(boardStateIndexes, player.username)
  }

  function generateGrid(player) {
    return (
      <div key={player.username} className="grid">
        {player.initialBoardState.map((key, index) => (
          <span
            key={key}
            id={`${player.username}-${index}`}
            className={boardState.includes(key) ? 'clicked' : 'animated-data'}>
            {key}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div className="bingo-body bingo-monitoring">
      <MonitoringGameInfo
        roomName={roomName}
        gameState={gameState}
        totalPlayers={totalPlayers}
        playersTurn={playersTurn}
        playersLimit={playersLimit}
      />
      <div className="bingo-wrapper">
        <div className="bingo">
          {roomPlayers.map((player) => (
            <div key={player.username}>
              <MonitoringPlayerInfo player={player} />
              {generateGrid(player)}
              <div key={player.bingoState} className="bingo-state">
                {player.bingoState}
              </div>
            </div>
          ))}
        </div>
        <MonitoringChat websocket={websocket} username={username} />
      </div>
    </div>
  )
}

export default BingoMonitoring