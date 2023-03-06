import { useState } from 'react';
import useWebSocket from 'react-use-websocket';

export const useSocketRooms = (websocketURL) => {
  const [rooms, setRooms] = useState([]);

  useWebSocket(websocketURL, {
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      if (data.command === 'room_added') {
        const roomExists = rooms.some((room) => room.room_id === data.room_id);
        if (!roomExists) {
          const newRoom = { room_id: data.room_id, room_name: data.room_name };
          setRooms((prevState) => [...prevState, newRoom]);
          return;
        }
      } else if (data.command === 'room_deleted') {
        setRooms((prevState) => prevState.filter((room) => room.room_id !== data.room_id));
        return;
      }
      if (data.command === 'online_rooms') setRooms(data.online_rooms);
    }
  });
  return [rooms];
};
