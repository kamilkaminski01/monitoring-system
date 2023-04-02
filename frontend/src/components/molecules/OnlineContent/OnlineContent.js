import './OnlineContent.scss';
import { GAME_TYPE } from 'utils/consts';

const OnlineContent = ({ content, type }) => {
  return (
    <div className="my-3">
      <h4>Online {type}:</h4>
      <div className="online-content">
        {content.length ? (
          content.map((child) => (
            <p
              key={type === GAME_TYPE.rooms ? child.room_name : child.username}
              className="online-child">
              {type === GAME_TYPE.rooms ? child.room_name : child.username}
            </p>
          ))
        ) : (
          <p className="online-child">No online {type}</p>
        )}
      </div>
    </div>
  );
};

export default OnlineContent;
