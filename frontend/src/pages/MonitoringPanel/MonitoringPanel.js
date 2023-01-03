import React, { useEffect, useState } from 'react';
import './MonitoringPanel.css';

const MonitoringPanel = () => {
  const [bingoRooms, setBingoRooms] = useState([]);
  const [tictactoeRooms, setTicTacToeRooms] = useState([]);

  useEffect(() => {
    const bingoOnlineRoomsUrl = 'ws://localhost:8000/ws/online-rooms/bingo/';
    const bingoOnlineRoomsSocket = new WebSocket(bingoOnlineRoomsUrl);

    bingoOnlineRoomsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.command === 'online_rooms') {
        setBingoRooms(data.online_rooms);
      }
      if (data.command === 'room_added') {
        setBingoRooms([...bingoRooms, { room_id: data.room_id, room_name: data.room_name }]);
      }
      if (data.command === 'room_deleted') {
        setBingoRooms(bingoRooms.filter((room) => room.room_id !== data.room_id));
      }
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const tictactoeOnlineRoomsUrl = 'ws://localhost:8000/ws/online-rooms/tictactoe/';
    const tictactoeOnlineRoomsSocket = new WebSocket(tictactoeOnlineRoomsUrl);

    tictactoeOnlineRoomsSocket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.command === 'online_rooms') {
        setTicTacToeRooms(data.online_rooms);
      }
      if (data.command === 'room_added') {
        setTicTacToeRooms([
          ...tictactoeRooms,
          { room_id: data.room_id, room_name: data.room_name }
        ]);
      }
      if (data.command === 'room_deleted') {
        setTicTacToeRooms(tictactoeRooms.filter((room) => room.room_id !== data.room_id));
      }
    };
    // eslint-disable-next-line
  }, []);

  return (
    <div className="container">
      <h2>Online bingo rooms:</h2>
      {bingoRooms.map((room) => (
        <a
          key={room.room_id}
          id={room.room_id}
          href={`http://localhost:8000/bingo/${room.room_name}`}>
          <div>
            <p>{room.room_name}</p>
          </div>
        </a>
      ))}
      <h2>Online tic tac toe rooms:</h2>
      {tictactoeRooms.map((room) => (
        <a
          key={room.room_id}
          id={room.room_id}
          href={`http://localhost:8000/tictactoe/${room.room_name}`}>
          <div>
            <p>{room.room_name}</p>
          </div>
        </a>
      ))}
    </div>
  );
};

export default MonitoringPanel;
