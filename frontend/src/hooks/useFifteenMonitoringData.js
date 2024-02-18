import { useEffect, useState } from 'react'
import { getAuthGameDetails } from 'utils/requests'

export const useFifteenMonitoringData = (endpoint, username) => {
  const [puzzleState, setPuzzleState] = useState([])
  const [gameState, setGameState] = useState(false)
  const [moves, setMoves] = useState(0)

  useEffect(() => {
    getAuthGameDetails(endpoint, username)
      .then((data) => {
        setPuzzleState(data.board_state)
        setGameState(data.game_state)
        setMoves(data.moves)
      })
      .catch(() => {
        window.close()
      })
  }, [endpoint, username])

  return {
    puzzleState,
    gameState,
    moves,
    setPuzzleState,
    setGameState,
    setMoves
  }
}
