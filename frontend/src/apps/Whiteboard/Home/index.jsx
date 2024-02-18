import './style.scss'
import { useContext, useState } from 'react'
import Input from 'components/atoms/Input'
import { UsernameContext } from 'providers/username/context'
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import HomeButton from 'components/atoms/HomeButton'
import OnlineContent from 'components/molecules/OnlineContent'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import { AuthContext } from 'providers/auth/context'

const WhiteboardHome = () => {
  const { isLogged } = useContext(AuthContext)
  const { username, setUsername } = useContext(UsernameContext)
  const [roomName, setRoomName] = useState('')
  const [whiteboardRooms] = useSocketRoomsAndUsers(WEBSOCKETS.whiteboardOnlineRooms)

  return (
    <div className="whiteboard-body">
      <div className="game-home-container">
        <div className="game-home-content">
          <div>
            <h2>Whiteboard</h2>
            <Input
              placeholder={'Your username'}
              value={username}
              onChange={(event) => setUsername(event.target.value)}
            />
            <Input
              placeholder={'Whiteboard name'}
              value={roomName}
              onChange={(event) => setRoomName(event.target.value)}
            />
            {!isLogged ? (
              <div className="game-home-room-options">
                <button
                  className="btn btn-light"
                  onClick={() =>
                    handleCreateRoom(
                      ENDPOINTS.checkWhiteboard,
                      ENDPOINTS.createWhiteboard,
                      username,
                      roomName
                    )
                  }>
                  Create whiteboard
                </button>
                <button
                  className="btn btn-light"
                  disabled={!roomName}
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
                </button>
              </div>
            ) : (
              <p className="no-room-options">
                To create or join whiteboards you should be logged out
              </p>
            )}
            <HomeButton className="btn-light" />
          </div>
          <OnlineContent
            content={whiteboardRooms}
            type={GAME_TYPE.rooms}
            typeName={'whiteboards'}
          />
        </div>
      </div>
    </div>
  )
}

export default WhiteboardHome
