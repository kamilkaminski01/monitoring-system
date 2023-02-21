import React, { useEffect, useRef, useState } from 'react';
import { PATHS } from 'utils/consts';
import './MonitoringPanelPage.scss';

const MonitoringPanelPage = () => {
  const [bingoRooms, setBingoRooms] = useState([]);
  const [tictactoeRooms, setTicTacToeRooms] = useState([]);
  const bingoSocketRef = useRef(null);
  const tictactoeSocketRef = useRef(null);

  const handleSocketMessage = (event, setRooms) => {
    const data = JSON.parse(event.data);
    switch (data.command) {
      case 'online_rooms':
        setRooms(data.online_rooms);
        break;
      case 'room_added':
        setRooms((prevState) => {
          if (prevState.some((room) => room.room_id === data.room_id)) {
            return prevState;
          } else {
            return [...prevState, { room_id: data.room_id, room_name: data.room_name }];
          }
        });
        break;
      case 'room_deleted':
        setRooms((prevState) => prevState.filter((room) => room.room_id !== data.room_id));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    bingoSocketRef.current = new WebSocket(PATHS.socketBingoRooms);
    bingoSocketRef.current.onmessage = (event) => handleSocketMessage(event, setBingoRooms);

    tictactoeSocketRef.current = new WebSocket(PATHS.socketTicTacToeRooms);
    tictactoeSocketRef.current.onmessage = (event) => handleSocketMessage(event, setTicTacToeRooms);

    return () => {
      if (bingoSocketRef.current.readyState === WebSocket.OPEN) {
        bingoSocketRef.current.close();
      }
      if (tictactoeSocketRef.current.readyState === WebSocket.OPEN) {
        tictactoeSocketRef.current.close();
      }
    };
  }, []);

  return (
    <div className="container">
      <div className="rooms-container">
        <h2>Bingo Rooms</h2>
        {bingoRooms.length ? (
          bingoRooms.map((room) => (
            <a
              key={room.room_id}
              id={room.room_id}
              className="online-room"
              href=""
              onClick={() =>
                window.open(`${PATHS.bingo}/${room.room_name}`, '_blank', 'height=700,width=1050')
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
        <h2>Tic Tac Toe Rooms</h2>
        {tictactoeRooms.length ? (
          tictactoeRooms.map((room) => (
            <a
              key={room.room_id}
              id={room.room_id}
              className="online-room"
              href=""
              onClick={() =>
                window.open(
                  `${PATHS.tictactoe}/${room.room_name}`,
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

export default MonitoringPanelPage;
