import { useContext, useState } from 'react'
import './style.scss'
import { ENDPOINTS, PATHS, TICTACTOE, WEBSOCKET_MESSAGES, WEBSOCKETS } from 'utils/consts'
import { UsernameContext } from 'providers/username/context'
import Button from 'components/atoms/Button'
import Chat from 'components/organisms/Chat'
import { useParams } from 'react-router-dom'
import useWebSocket from 'react-use-websocket'
import useUsername from 'hooks/useUsername.js'
import { useTicTacToeData } from 'hooks/useTicTacToeData'
import { putRoomDetails, putRoomDetailsPlayer, roomDetails } from 'utils/requests'
import { swalError, swalSuccess, swalTimedCornerSuccess, swalWarning } from 'utils/swal'
import { useSocketLeave } from 'hooks/useSocketLeave'
import GameInfo from 'components/molecules/GameInfo'
import GameLayout from 'components/atoms/GameLayout'

const TicTacToe = () => {
  const { isUsernameSet } = useContext(UsernameContext)
  const username = useUsername()
  const { roomName } = useParams()
  const detailsRoomEndpoint = ENDPOINTS.detailsTicTacToeRoom
  const websocket = `${WEBSOCKETS.tictactoe}/${roomName}/`
  const {
    gameState,
    readyState,
    totalPlayers,
    players,
    playersTurn,
    figure,
    boardState,
    setGameState,
    setReadyState,
    setPlayers,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState,
    navigate
  } = useTicTacToeData(detailsRoomEndpoint, roomName, username)
  const [showGameInfo, setShowGameInfo] = useState(true)

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: () => {
      if (isUsernameSet) sendJsonMessage(WEBSOCKET_MESSAGES.join(username))
    },
    onMessage: async (message) => {
      const data = JSON.parse(message.data)
      const command = data.command
      const user = data.user
      const updatedBoardState = data.value
      if (command === 'click' && user !== username) {
        setBoardState(updatedBoardState)
      } else if (command === 'restart') {
        setBoardState(TICTACTOE.defaultBoardState)
        setGameState(true)
        swalTimedCornerSuccess('The game has restarted', 'New game')
        if (!readyState) setShowGameInfo(true)
      } else if (command === 'win') {
        setGameState(false)
        user === username
          ? await swalSuccess('Nice!', 'You won the game')
          : await swalError('Sorry', 'You lost')
        setShowGameInfo(true)
      } else if (command === 'over') {
        setGameState(false)
        await swalWarning('Game over!', 'No one won')
        setShowGameInfo(true)
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
              if (player.is_ready && user === username && command !== 'over') setShowGameInfo(false)
            })
            .catch(() => {
              navigate(PATHS.tictactoe)
            })
        }, 50)
      }
    }
  })

  useSocketLeave(websocket, username, sendJsonMessage)

  const checkWin = async (boardState) => {
    for (let i = 0; i < TICTACTOE.winRows.length; i++) {
      const [a, b, c] = TICTACTOE.winRows[i]
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        await putRoomDetailsPlayer(ENDPOINTS.detailsTicTacToePlayer, roomName, username, {
          is_winner: true
        })
        return sendJsonMessage(WEBSOCKET_MESSAGES.win(username))
      }
    }
    if (boardState.every((value) => value !== ''))
      sendJsonMessage(WEBSOCKET_MESSAGES.over(username, boardState))
  }

  const handleBoardClick = async (index) => {
    if (!gameState) return swalWarning('Game finished', 'Restart to play again')
    if (totalPlayers !== 2) return swalWarning('Wait', 'Not enough players')
    if (!readyState) return swalWarning('Wait', "You aren't ready")
    if (!players.every((player) => player.is_ready))
      return swalWarning('Wait', "Your opponent isn't ready")
    if (playersTurn !== username) return swalWarning('Wait', "It's not your turn")
    if (boardState[index] !== '') return swalWarning('Oops...', 'Already selected')
    const newBoardState = [...boardState]
    newBoardState[index] = figure
    setBoardState(newBoardState)
    await putRoomDetails(detailsRoomEndpoint, roomName, { board_state: newBoardState })
    sendJsonMessage(WEBSOCKET_MESSAGES.click(username, newBoardState))
    await checkWin(newBoardState)
    roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
      setPlayersTurn(data.players_turn)
    })
  }

  const boardElements = boardState.map((value, index) => (
    <div key={index} id={index} className="game-grid__tile" onClick={() => handleBoardClick(index)}>
      {value}
    </div>
  ))

  return (
    <GameLayout className="tictactoe game">
      <div className="game__options">
        <Button value="Home" onClick={() => (window.location.href = PATHS.home)} />
        <Button value="Menu" onClick={() => (window.location.href = PATHS.tictactoe)} />
        <Button
          value="Restart"
          disabled={gameState}
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
            endpoint={ENDPOINTS.detailsTicTacToePlayer}
            sendJsonMessage={sendJsonMessage}
          />
        ) : (
          <div className="tictactoe__game animation--fade-in">
            <div className="game__username">{username}</div>
            <div className="game__scoreboard">
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
            <div className="tictactoe__game-grid">{boardElements}</div>
          </div>
        )}
        <Chat websocket={websocket} username={username} />
      </div>
    </GameLayout>
  )
}

export default TicTacToe
