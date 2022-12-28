import React, { useState } from 'react';
import { useOnlineRooms } from '../../hooks/useOnlineRooms';

const MonitoringPanel = () => {
  const [onlineRooms, setOnlineRooms] = useState([]);

  useOnlineRooms('ws://localhost:8000/ws/monitoring/tictactoe', (event) => {
    setOnlineRooms(JSON.parse(event.data));
  });

  return (
    <div>
      <h2>Open Tic Tac Toe Games:</h2>
      <ul>
        {onlineRooms.map((room) => (
          <li key={room.room_id}>{room.room_name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MonitoringPanel;
