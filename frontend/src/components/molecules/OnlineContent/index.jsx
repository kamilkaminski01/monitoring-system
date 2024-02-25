import './style.scss'
import { GAME_TYPE } from 'utils/consts'
import classNames from 'classnames'

const OnlineContent = ({ content, type, className, typeName = null }) => {
  return (
    <div className="online-content">
      <h4 className={classNames('online-content__title', className)}>Online {typeName || type}</h4>
      <div className="online-content__items">
        {content.length ? (
          content.map((child) => (
            <p
              key={type === GAME_TYPE.rooms ? child.room_name : child.username}
              className="items__child">
              {type === GAME_TYPE.rooms ? child.room_name : child.username}
            </p>
          ))
        ) : (
          <p className="items__child">No online {typeName || type}</p>
        )}
      </div>
    </div>
  )
}

export default OnlineContent
