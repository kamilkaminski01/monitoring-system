import { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import './style.scss'
import useUsername from 'hooks/useUsername'
import { UsernameContext } from 'providers/username/context'
import Chat from 'components/organisms/Chat'
import Button from 'components/atoms/Button'
import { BINGO, ENDPOINTS, PATHS, WEBSOCKET_MESSAGES, WEBSOCKETS } from 'utils/consts'
import { generateBoardState, getBoardStateIndexes, highlightBingo } from 'utils/boards'
import useWebSocket from 'react-use-websocket'
import { swalError, swalSuccess, swalTimedCornerSuccess, swalWarning } from 'utils/swal'
import { putRoomDetailsPlayer, roomDetails, putRoomDetails } from 'utils/requests'
import { useBingoData } from 'hooks/useBingoData'
import { useSocketLeave } from 'hooks/useSocketLeave'
import GameInfo from 'components/molecules/GameInfo'
import GameLayout from 'components/atoms/GameLayout'

const Bingo = () => {
  const { isUsernameSet } = useContext(UsernameContext)
  const username = useUsername()
  const { roomName } = useParams()
  const detailsPlayerEndpoint = ENDPOINTS.detailsBingoPlayer
  const detailsRoomEndpoint = ENDPOINTS.detailsBingoRoom
  const websocket = `${WEBSOCKETS.bingo}/${roomName}/`
  const {
    gameState,
    players,
    readyState,
    totalPlayers,
    playersLimit,
    playersTurn,
    bingoState,
    boardState,
    boardStateIndexes,
    initialBoardState,
    setPlayers,
    setReadyState,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState,
    setBingoState,
    setBoardStateIndexes,
    setInitialBoardState,
    navigate
  } = useBingoData(detailsRoomEndpoint, roomName, username)
  const [showGameInfo, setShowGameInfo] = useState(true)

  useEffect(() => {
    if (!showGameInfo) highlightBingo(boardStateIndexes, username)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showGameInfo])

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: async () => {
      roomDetails(detailsRoomEndpoint, roomName, true).then(async (data) => {
        const currentPlayer = data.players.find((player) => player.username === username)
        if (currentPlayer.initial_board_state.length === 0) {
          await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, {
            initial_board_state: initialBoardState
          })
        } else {
          const indexes = getBoardStateIndexes(data.board_state, currentPlayer.initial_board_state)
          setBoardStateIndexes(indexes)
          setInitialBoardState(currentPlayer.initial_board_state)
          generateGrid()
          await checkBingo(indexes, data.game_state)
        }
      })
      if (isUsernameSet) sendJsonMessage(WEBSOCKET_MESSAGES.join(username))
    },
    onMessage: async (message) => {
      const data = JSON.parse(message.data)
      const command = data.command
      const user = data.user
      const value = data.value
      const index = initialBoardState.indexOf(value)
      if ((command === 'click' || command === 'win') && user !== username && gameState !== false) {
        const updatedBoardState = [...boardState, value]
        const updatedBoardStateIndexes = [...boardStateIndexes, index]
        setBoardState(updatedBoardState)
        setBoardStateIndexes(updatedBoardStateIndexes)
        if (command === 'win') {
          setGameState(false)
          await swalError('Sorry', 'You lost')
          setShowGameInfo(true)
        } else {
          await checkBingo(updatedBoardStateIndexes, gameState)
        }
      } else if (command === 'restart') {
        const generatedBoardState = generateBoardState()
        setBoardState([])
        setBoardStateIndexes([])
        setBingoState([])
        setInitialBoardState(generatedBoardState)
        setGameState(true)
        await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, {
          initial_board_state: generatedBoardState
        })
        generateGrid()
        swalTimedCornerSuccess('The game has restarted', 'New game')
        if (!readyState) setShowGameInfo(true)
      }
      if (command !== 'message') {
        setTimeout(() => {
          roomDetails(detailsRoomEndpoint, roomName, true)
            .then((data) => {
              const player = data.players.find((p) => p.username === username)
              setTotalPlayers(data.total_players)
              setPlayersTurn(data.players_turn)
              setPlayers(data.players)
              setReadyState(player.is_ready)
              if (player.is_ready && user === username) setShowGameInfo(false)
            })
            .catch(() => {
              navigate(PATHS.bingo)
            })
        }, 50)
      }
    }
  })

  useSocketLeave(websocket, username, sendJsonMessage)

  const checkBingo = async (boardStateIndexes, gameState) => {
    const bingoState = []
    const playerData = { username }
    for (let i = 0; i < BINGO.winRows.length; i++) {
      const row = BINGO.winRows[i]
      const isBingo = row.every((index) => boardStateIndexes.includes(index))
      if (isBingo) {
        bingoState.push(BINGO.winState[bingoState.length])
        highlightBingo(boardStateIndexes, username)
      }
    }
    playerData.is_winner = bingoState.length >= 5
    playerData.bingo_state = bingoState
    setBingoState(bingoState)
    await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, playerData)
    if (playerData.is_winner && gameState) {
      setGameState(false)
      sendJsonMessage(WEBSOCKET_MESSAGES.win(username))
      await swalSuccess('BINGO!', 'You won the game')
      setShowGameInfo(true)
    }
  }

  const handleGridClick = async (key, index) => {
    if (!gameState) return swalWarning('Game finished', 'Restart to play again')
    if (totalPlayers !== playersLimit) return swalWarning('Wait', 'Not enough players')
    if (!readyState) return swalWarning('Wait', "You aren't ready")
    if (!players.every((player) => player.is_ready))
      return swalWarning('Wait', 'Not everyone is ready')
    if (playersTurn !== username) return swalWarning('Wait', "It's not your turn")
    if (boardState.includes(key)) return swalWarning('Oops...', 'Already selected')
    sendJsonMessage(WEBSOCKET_MESSAGES.click(username, key))
    const updatedBoardState = [...boardState, key]
    const updatedBoardStateIndexes = [...boardStateIndexes, index]
    setBoardState(updatedBoardState)
    setBoardStateIndexes(updatedBoardStateIndexes)
    await putRoomDetails(detailsRoomEndpoint, roomName, { board_state: updatedBoardState })
    await checkBingo(updatedBoardStateIndexes, gameState)
    roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
      setPlayersTurn(data.players_turn)
    })
  }

  const generateGrid = () => {
    return (
      <div className="bingo__game-grid animation--fade-in">
        {initialBoardState.map((key, index) => (
          <span
            key={key}
            id={`${username}-${index}`}
            onClick={() => handleGridClick(key, index)}
            className={boardState.includes(key) ? 'clicked' : 'animation--fade-in'}>
            {key}
          </span>
        ))}
      </div>
    )
  }

  return (
    <GameLayout className="bingo game">
      <div className="game__options">
        <Button value="Home" onClick={() => (window.location.href = PATHS.home)} />
        <Button value="Menu" onClick={() => (window.location.href = PATHS.bingo)} />
        <Button
          value="Restart"
          disable={gameState}
          onClick={() => sendJsonMessage(WEBSOCKET_MESSAGES.restart(username))}
        />
        <Button
          value={showGameInfo ? 'Board' : 'Details'}
          onClick={() => setShowGameInfo(!showGameInfo)}
        />
      </div>
      <div className="game__content">
        {showGameInfo ? (
          <GameInfo
            players={players}
            username={username}
            roomName={roomName}
            endpoint={detailsPlayerEndpoint}
            sendJsonMessage={sendJsonMessage}
          />
        ) : (
          <div className="bingo__game animation--fade-in">
            <div className="game__scoreboard">
              <div className="scoreboard__username">{username}</div>
              <div>Players limit: {playersLimit}</div>
              <div className="scoreboard__room-info">
                <div>
                  Total players:{' '}
                  <span key={totalPlayers} className="animation--fade-in">
                    {totalPlayers}
                  </span>
                </div>
                <div key={playersTurn} className="animation--fade-in">
                  {playersTurn}&apos;s turn
                </div>
              </div>
            </div>
            {generateGrid()}
            <div key={bingoState} className="bingo__state animation--fade-in-up">
              {bingoState}
            </div>
          </div>
        )}
        <Chat websocket={websocket} username={username} />
      </div>
    </GameLayout>
  )
}

export default Bingo
