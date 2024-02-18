import { useContext } from 'react'
import './style.scss'
import { UsernameContext } from 'providers/username/context'
import Input from 'components/atoms/Input'
import HomeButton from 'components/atoms/HomeButton'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import { handleCreateGame } from 'utils/handleRooms'
import OnlineContent from 'components/molecules/OnlineContent'

const FifteenHome = () => {
  const { username, setUsername } = useContext(UsernameContext)
  const [, users] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers)

  return (
    <div className="fifteen-body">
      <div className="game-home-container">
        <div className="game-home-content">
          <h2 className="my-3 text-center">Fifteen Puzzle</h2>
          <Input
            placeholder={'Your username'}
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
          <button
            className="my-3 btn btn-outline-primary"
            disabled={!username}
            onClick={() =>
              handleCreateGame(
                ENDPOINTS.checkFifteenPuzzle,
                ENDPOINTS.createFifteenPuzzle,
                username
              )
            }>
            Start
          </button>
          <HomeButton className="btn-outline-primary" />
          <OnlineContent content={users} type={GAME_TYPE.users} />
        </div>
      </div>
    </div>
  )
}

export default FifteenHome
