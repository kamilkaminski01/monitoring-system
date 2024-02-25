import './style.scss'
import { deleteAuthGame, deleteAuthRoom } from 'utils/requests'
import { GAME_TYPE } from 'utils/consts'

const Panel = ({ gameName, items, path, endpoint, panelType, panelTypeName = null }) => {
  const handleClick = (event, gameName, path, item) => {
    event.preventDefault()
    const location = panelType === GAME_TYPE.users ? item.username : item.room_name
    window.open(`${path}/${location}`, `${gameName}/${location}`, 'height=900,width=1440')
  }

  const handleDelete = async (event, item) => {
    event.stopPropagation()
    panelType === GAME_TYPE.users
      ? await deleteAuthGame(endpoint, item.username)
      : await deleteAuthRoom(endpoint, item.room_name)
  }

  return (
    <div className="panel">
      <h2 className="panel__title">{gameName}</h2>
      {items.length ? (
        items.map((item) => (
          <div
            className="panel__online-game"
            key={panelType === GAME_TYPE.users ? item.username : item.room_id}
            onClick={(event) => handleClick(event, gameName, path, item)}>
            <p>{panelType === GAME_TYPE.users ? item.username : item.room_name}</p>
            <div className="online-game__close-btn" onClick={(event) => handleDelete(event, item)}>
              &times;
            </div>
          </div>
        ))
      ) : (
        <p className="panel__info">No online {panelTypeName || panelType}</p>
      )}
    </div>
  )
}

export default Panel
