import { useContext, useState } from 'react'
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import { UsernameContext } from 'providers/username/context'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import GameLayout from 'components/atoms/GameLayout'
import Button from 'components/atoms/Button'
import Input from 'components/atoms/Input'
import HomeLink from 'components/atoms/HomeLink'
import OnlineContent from 'components/molecules/OnlineContent'
import useDocumentTitle from 'hooks/useDocumentTitle'

const TicTacToeMenu = () => {
  useDocumentTitle('Tic Tac Toe | Menu')
  const { username, setUsername } = useContext(UsernameContext)
  const [roomName, setRoomName] = useState('')
  const [tictactoeRooms] = useSocketRoomsAndUsers(WEBSOCKETS.tictactoeOnlineRooms)

  return (
    <GameLayout className="tictactoe game-menu">
      <div className="game-menu__content">
        <h2 className="content__title">Tic Tac Toe</h2>
        <Input
          placeholder="Your username"
          value={username}
          className="input-menu"
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          placeholder="Room name"
          value={roomName}
          className="input-menu"
          onChange={(event) => setRoomName(event.target.value)}
        />
        <div className="content__options">
          <Button
            className="btn-menu"
            onClick={() =>
              handleCreateRoom(
                ENDPOINTS.checkTicTacToeRoom,
                ENDPOINTS.createTicTacToeRoom,
                username,
                roomName
              )
            }>
            Create Room
          </Button>
          <Button
            className="btn-menu"
            disable={!roomName}
            onClick={() =>
              handleJoinRoom(
                ENDPOINTS.checkTicTacToeRoom,
                ENDPOINTS.detailsTicTacToeRoom,
                ENDPOINTS.createTicTacToeRoom,
                username,
                roomName
              )
            }>
            Join Room
          </Button>
        </div>
        <HomeLink className="tictactoe" />
        <OnlineContent content={tictactoeRooms} type={GAME_TYPE.rooms} />
      </div>
    </GameLayout>
  )
}

export default TicTacToeMenu
