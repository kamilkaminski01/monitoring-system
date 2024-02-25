import { useContext, useState } from 'react'
import { ENDPOINTS, GAME_TYPE, WEBSOCKETS } from 'utils/consts'
import './style.scss'
import { UsernameContext } from 'providers/username/context'
import { handleCreateRoom, handleJoinRoom } from 'utils/handleRooms'
import { useSocketRoomsAndUsers } from 'hooks/useSocketRoomsAndUsers'
import GameLayout from 'components/atoms/GameLayout'
import Button from 'components/atoms/Button'
import Checkbox from 'components/atoms/Checkbox'
import Input from 'components/atoms/Input'
import HomeLink from 'components/atoms/HomeLink'
import OnlineContent from 'components/molecules/OnlineContent'

const BingoMenu = () => {
  const { username, setUsername } = useContext(UsernameContext)
  const [roomName, setRoomName] = useState('')
  const [playersLimit, setPlayersLimit] = useState('')
  const [isPopupOpen, setIsPopupOpen] = useState(false)
  const [bingoRooms] = useSocketRoomsAndUsers(WEBSOCKETS.bingoOnlineRooms)

  return (
    <GameLayout className="bingo game-menu">
      <div className="game-menu__content">
        <h2 className="content__title">Bingo</h2>
        <Input
          placeholder={'Your username'}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
        />
        <Input
          placeholder={'Room name'}
          value={roomName}
          onChange={(event) => setRoomName(event.target.value)}
        />
        <div className="content__options">
          <Button className="home-btn" onClick={() => setIsPopupOpen(true)}>
            Create Room
          </Button>
          <Button
            className="home-btn"
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
      <div className={`popup ${isPopupOpen ? 'active' : ''}`}>
        <div className="close-btn" onClick={() => setIsPopupOpen(false)}>
          &times;
        </div>
        <div className="form">
          <h2>Players Limit</h2>
          <Checkbox
            value="2"
            checked={playersLimit === 2}
            onChange={(event) => setPlayersLimit(parseInt(event.target.value))}
          />
          <Checkbox
            value="3"
            checked={playersLimit === 3}
            onChange={(event) => setPlayersLimit(parseInt(event.target.value))}
          />
          <Checkbox
            value="4"
            checked={playersLimit === 4}
            onChange={(event) => setPlayersLimit(parseInt(event.target.value))}
          />
          <button
            onClick={() =>
              handleCreateRoom(
                ENDPOINTS.checkBingoRoom,
                ENDPOINTS.createBingoRoom,
                username,
                roomName,
                playersLimit
              )
            }>
            Confirm
          </button>
        </div>
      </div>
    </GameLayout>
  )
}

export default BingoMenu
