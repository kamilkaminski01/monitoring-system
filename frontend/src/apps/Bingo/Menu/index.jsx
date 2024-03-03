import { useContext, useState } from 'react'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import { UsernameContext } from 'providers/username/context'
import { handleJoinRoom } from 'utils/handleRooms'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import GameLayout from 'components/atoms/GameLayout'
import Button from 'components/atoms/Button'
import Input from 'components/atoms/Input'
import HomeLink from 'components/atoms/HomeLink'
import OnlineContent from 'components/molecules/OnlineContent'
import { useModals } from 'providers/modals/context'
import PlayersLimitModal from './modals/PlayersLimitModal.jsx'
import useDocumentTitle from 'hooks/useDocumentTitle'

const BingoMenu = () => {
  useDocumentTitle('Bingo | Menu')
  const { openModal } = useModals()
  const { username, setUsername } = useContext(UsernameContext)
  const [roomName, setRoomName] = useState('')
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms)

  return (
    <GameLayout className="bingo game-menu">
      <div className="game-menu__content">
        <h2 className="content__title">Bingo</h2>
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
            onClick={() => openModal(<PlayersLimitModal roomName={roomName} />)}>
            Create Room
          </Button>
          <Button
            className="btn-menu"
            disable={!roomName}
            onClick={() =>
              handleJoinRoom(
                ENDPOINTS.checkBingoRoom,
                ENDPOINTS.detailsBingoRoom,
                ENDPOINTS.createBingoRoom,
                username,
                roomName
              )
            }>
            Join Room
          </Button>
        </div>
        <HomeLink className="bingo" />
        <OnlineContent content={bingoRooms} type={GAME_TYPE.rooms} className="bingo" />
      </div>
    </GameLayout>
  )
}

export default BingoMenu
