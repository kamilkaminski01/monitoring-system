import Modal from 'components/organisms/Modal'
import Checkbox from 'components/atoms/Checkbox'
import { handleCreateRoom } from 'utils/handleRooms'
import { ENDPOINTS } from 'utils/consts'
import { useContext, useState } from 'react'
import { UsernameContext } from 'providers/username/context'

const PlayersLimitModal = ({ roomName }) => {
  const { username } = useContext(UsernameContext)
  const [playersLimit, setPlayersLimit] = useState('')

  return (
    <Modal
      className="bingo"
      title="Players Limit"
      buttonText="Confirm"
      onSubmit={() =>
        handleCreateRoom(
          ENDPOINTS.checkBingoRoom,
          ENDPOINTS.createBingoRoom,
          username,
          roomName,
          playersLimit
        )
      }>
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
    </Modal>
  )
}

export default PlayersLimitModal
