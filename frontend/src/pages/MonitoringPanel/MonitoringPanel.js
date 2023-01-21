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
      <div className="rooms-container">
        <h2>Online Bingo Rooms</h2>
        {bingoRooms.length ? (
          bingoRooms.map((room) => (
            <a
              key={room.room_id}
              id={room.room_id}
              className="online-room"
              href=""
              onClick={() =>
                window.open(
                  `http://localhost:8000/bingo/${room.room_name}`,
                  '_blank',
                  'height=700,width=1050'
                )
              }>
              <div>
                <p>{room.room_name}</p>
              </div>
            </a>
          ))
        ) : (
          <p className="no-rooms">No online bingo rooms</p>
        )}
      </div>
      <div className="rooms-container">
        <h2>Online Tic Tac Toe Rooms</h2>
        {tictactoeRooms.length ? (
          tictactoeRooms.map((room) => (
            <a
              key={room.room_id}
              id={room.room_id}
              className="online-room"
              href=""
              onClick={() =>
                window.open(
                  `http://localhost:8000/tictactoe/${room.room_name}`,
                  '_blank',
                  'height=700,width=1050'
                )
              }>
              <div>
                <p>{room.room_name}</p>
              </div>
            </a>
          ))
        ) : (
          <p className="no-rooms">No online tic tac toe rooms</p>
        )}
      </div>
    </div>
  );
};

export default MonitoringPanel;
