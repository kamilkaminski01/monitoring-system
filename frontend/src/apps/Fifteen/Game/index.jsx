import { useContext } from 'react'
import './style.scss'
import useUsername from 'hooks/useUsername'
import { UsernameContext } from 'providers/username/context'
import { ENDPOINTS, PATHS, WEBSOCKET_MESSAGES, WEBSOCKETS } from 'utils/consts'
import useWebSocket from 'react-use-websocket'
import { useSocketLeave } from 'hooks/useSocketLeave'
import Chat from 'components/organisms/Chat'
import { swalSuccess, swalTimedCornerSuccess, swalWarning } from 'utils/swal'
import { putGameDetails } from 'utils/requests'
import { useFifteenData } from 'hooks/useFifteenData'
import { generatePuzzleState } from 'utils/boards'
import Button from 'components/atoms/Button'
import GameLayout from 'components/atoms/GameLayout'
import { useParams } from 'react-router-dom'
import useDocumentTitle from 'hooks/useDocumentTitle'

const Fifteen = () => {
  const { userName } = useParams()
  useDocumentTitle(`${userName} | Fifteen Puzzle`)
  const { isUsernameSet } = useContext(UsernameContext)
  const username = useUsername()
  const websocket = `${WEBSOCKETS.fifteen}/${username}/`
  const endpoint = ENDPOINTS.detailsFifteenPuzzle
  const { puzzleState, gameState, moves, setPuzzleState, setGameState, setMoves, navigate } =
    useFifteenData(endpoint, username)

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: () => {
      if (username) {
        putGameDetails(endpoint, username, {
          board_state: puzzleState
        }).then((response) => {
          try {
            if (response.response.status === 404) navigate(PATHS.fifteen)
          } catch {}
        })
      } else {
        navigate(PATHS.fifteen)
      }
      if (isUsernameSet) sendJsonMessage(WEBSOCKET_MESSAGES.join(username))
    }
  })

  useSocketLeave(websocket, username, sendJsonMessage)

  const onRestart = async () => {
    const generatedPuzzleState = generatePuzzleState()
    setPuzzleState(generatedPuzzleState)
    setMoves(0)
    setGameState(true)
    await putGameDetails(endpoint, username, {
      board_state: generatedPuzzleState,
      moves: 0,
      game_state: true
    })
    sendJsonMessage(WEBSOCKET_MESSAGES.restart(username))
    swalTimedCornerSuccess('The game has restarted', 'New game')
  }

  const isPuzzleSolved = (puzzleState) => {
    const flattened = puzzleState.flat().filter((value) => value !== null)
    for (let i = 0; i < flattened.length; i++) {
      if (flattened[i] !== i + 1) {
        return false
      }
    }
    return true
  }

  const handleTileClick = async (value) => {
    if (!gameState) return swalWarning('Puzzle solved', 'Restart to create a new puzzle')
    const rowIndex = puzzleState.findIndex((row) => row.includes(value))
    const colIndex = puzzleState[rowIndex].indexOf(value)
    const nullRow = puzzleState.findIndex((row) => row.includes(null))
    const nullCol = puzzleState[nullRow].indexOf(null)
    const isAdjacent =
      (rowIndex === nullRow && Math.abs(colIndex - nullCol) === 1) ||
      (colIndex === nullCol && Math.abs(rowIndex - nullRow) === 1)
    if (isAdjacent) {
      const newPuzzleState = puzzleState.map((row) => [...row])
      const movesValue = moves + 1
      setMoves(movesValue)
      newPuzzleState[nullRow][nullCol] = value
      newPuzzleState[rowIndex][colIndex] = null
      setPuzzleState(newPuzzleState)
      await putGameDetails(ENDPOINTS.detailsFifteenPuzzle, username, {
        board_state: newPuzzleState,
        moves: movesValue
      }).then((response) => {
        try {
          if (response.response.status === 404) navigate(PATHS.fifteen)
        } catch {}
      })
      sendJsonMessage(WEBSOCKET_MESSAGES.click(username, newPuzzleState))
      if (isPuzzleSolved(newPuzzleState)) {
        setGameState(false)
        sendJsonMessage(WEBSOCKET_MESSAGES.win(username))
        await swalSuccess('Nice!', 'You solved the puzzle')
      }
    }
  }

  return (
    <GameLayout className="fifteen game">
      <div className="game__options">
        <Button value="Home" onClick={() => (window.location.href = PATHS.home)} />
        <Button value="Menu" onClick={() => (window.location.href = PATHS.fifteen)} />
      </div>
      <div className="game__content">
        <div className="fifteen__game animation--fade-in">
          <div className="fifteen__game-grid">
            {puzzleState.map((row) =>
              row.map((value) => (
                <div key={value} className="grid__tile" onClick={() => handleTileClick(value)}>
                  {value}
                </div>
              ))
            )}
          </div>
          <div className="game__scoreboard">
            <div className="scoreboard__moves">
              Moves:
              <span key={moves} className="animation--fade-in">
                {' '}
                {moves}
              </span>
            </div>
            <Button value="Restart" onClick={() => onRestart()} />
          </div>
        </div>
        <Chat websocket={websocket} username={username} />
      </div>
    </GameLayout>
  )
}

export default Fifteen
