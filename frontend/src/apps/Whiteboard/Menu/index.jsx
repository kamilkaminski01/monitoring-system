import './style.scss'
import { useContext, useState } from 'react'
import GameLayout from 'components/atoms/GameLayout'
import Input from 'components/atoms/Input'
import Button from 'components/atoms/Button'
import { UsernameContext } from 'providers/username/context'
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import HomeLink from 'components/atoms/HomeLink'
import OnlineContent from 'components/molecules/OnlineContent'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import { AuthContext } from 'providers/auth/context'

const WhiteboardMenu = () => {
  const { isLogged } = useContext(AuthContext)
  const { username, setUsername } = useContext(UsernameContext)
  const [roomName, setRoomName] = useState('')
  const [whiteboardRooms] = useSocketRoomsAndUsers(WEBSOCKETS.whiteboardOnlineRooms)

  return (
    <GameLayout className="whiteboard game-menu">
      <div className="game-menu__content">
        <h2 className="content__title">Whiteboard</h2>
        <Input
          placeholder="Your username"
          value={username}
          className="input-menu"
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          placeholder="Whiteboard name"
          value={roomName}
          className="input-menu"
          onChange={(event) => setRoomName(event.target.value)}
        />
        {!isLogged ? (
          <div className="content__options">
            <Button
              className="btn-menu"
              onClick={() =>
                handleCreateRoom(
                  ENDPOINTS.checkWhiteboard,
                  ENDPOINTS.createWhiteboard,
                  username,
                  roomName
                )
              }>
              Create whiteboard
            </Button>
            <Button
              className="btn-menu"
              disable={!roomName}
              onClick={() =>
                handleJoinRoom(
                  ENDPOINTS.checkWhiteboard,
                  ENDPOINTS.detailsWhiteboard,
                  ENDPOINTS.createWhiteboard,
                  username,
                  roomName
                )
              }>
              Join whiteboard
            </Button>
          </div>
        ) : (
          <p className="content__options--disabled">
            To create or join whiteboards you should be logged out
          </p>
        )}
        <HomeLink className="whiteboard" />
        <OnlineContent
          content={whiteboardRooms}
          type={GAME_TYPE.rooms}
          typeName="whiteboards"
          className="whiteboard"
        />
      </div>
    </GameLayout>
  )
}

export default WhiteboardMenu
