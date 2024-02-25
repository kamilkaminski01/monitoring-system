import { useContext } from 'react'
import { UsernameContext } from 'providers/username/context'
import GameLayout from 'components/atoms/GameLayout'
import Button from 'components/atoms/Button'
import Input from 'components/atoms/Input'
import HomeLink from 'components/atoms/HomeLink'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import { handleCreateGame } from 'utils/handleRooms'
import OnlineContent from 'components/molecules/OnlineContent'

const FifteenMenu = () => {
  const { username, setUsername } = useContext(UsernameContext)
  const [, users] = useSocketRoomsAndUsers(WEBSOCKETS.fifteenOnlineUsers)

  return (
    <GameLayout className="fifteen game-menu">
      <div className="game-menu__content">
        <h2 className="content__title">Fifteen Puzzle</h2>
        <Input
          placeholder={'Your username'}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <div className="content__options">
          <Button
            className="home-btn"
            disable={!username}
            onClick={() =>
              handleCreateGame(
                ENDPOINTS.checkFifteenPuzzle,
                ENDPOINTS.createFifteenPuzzle,
                username
              )
            }>
            Start
          </Button>
        </div>
        <HomeLink className="fifteen" />
        <OnlineContent content={users} type={GAME_TYPE.users} />
      </div>
    </GameLayout>
  )
}

export default FifteenMenu
