import './OnlineUsers.scss';

const OnlineUsers = ({ users }) => {
  return (
    <div className="my-3">
      <h4>Online Users:</h4>
      <div className="online-content">
        {users.length ? (
          users.map((user) => (
            <p key={user.username} className="online-child">
              {user.username}
            </p>
          ))
        ) : (
          <p className="online-child">No online users</p>
        )}
      </div>
    </div>
  );
};
export default OnlineUsers;
