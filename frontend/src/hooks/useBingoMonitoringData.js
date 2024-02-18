import { useEffect, useState } from 'react'
import { getAuthRoomDetails } from 'utils/requests'

export const useBingoMonitoringData = (endpoint, roomName, username) => {
  const [roomPlayers, setRoomPlayers] = useState([])
  const [totalPlayers, setTotalPlayers] = useState(0)
  const [boardState, setBoardState] = useState([])
  const [gameState, setGameState] = useState(false)
  const [playersTurn, setPlayersTurn] = useState('')
  const [playersLimit, setPlayersLimit] = useState(0)

  useEffect(() => {
    getAuthRoomDetails(endpoint, roomName, true).then((data) => {
      setGameState(data.game_state)
      setTotalPlayers(data.total_players)
      setPlayersTurn(data.players_turn)
      setBoardState(data.board_state)
      setPlayersLimit(data.players_limit)
      const playersData = data.players.map((player) => {
        return {
          username: player.username,
          isActive: player.is_active,
          isWinner: player.is_winner,
          bingoState: player.bingo_state,
          initialBoardState: player.initial_board_state
        }
      })
      setRoomPlayers(playersData)
    })
  }, [endpoint, roomName, username])

  return {
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
  }
}
