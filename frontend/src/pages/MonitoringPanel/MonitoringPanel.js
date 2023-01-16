import React, { useEffect, useRef, useState } from 'react';
import './MonitoringPanel.css';

const MonitoringPanel = () => {
  const [bingoRooms, setBingoRooms] = useState([]);
  const [tictactoeRooms, setTicTacToeRooms] = useState([]);
  const bingoSocketRef = useRef(null);
  const tictactoeSocketRef = useRef(null);

  useEffect(() => {
    bingoSocketRef.current = new WebSocket('ws://localhost:8000/ws/online-rooms/bingo/');
    bingoSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.command === 'online_rooms') {
        setBingoRooms(data.online_rooms);
      }
      if (data.command === 'room_added') {
        setBingoRooms((prevState) => [
          ...prevState,
          { room_id: data.room_id, room_name: data.room_name }
        ]);
      }
      if (data.command === 'room_deleted') {
        setBingoRooms((prevState) => prevState.filter((room) => room.room_id !== data.room_id));
      }
    };

    tictactoeSocketRef.current = new WebSocket('ws://localhost:8000/ws/online-rooms/tictactoe/');
    tictactoeSocketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.command === 'online_rooms') {
        setTicTacToeRooms(data.online_rooms);
      }
      if (data.command === 'room_added') {
        setTicTacToeRooms((prevState) => [
          ...prevState,
          { room_id: data.room_id, room_name: data.room_name }
        ]);
      }
      if (data.command === 'room_deleted') {
        setTicTacToeRooms((prevState) => prevState.filter((room) => room.room_id !== data.room_id));
      }
    };
  }, []);

  useEffect(() => {
    return () => {
      bingoSocketRef.current.close();
      tictactoeSocketRef.current.close();
    };
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
