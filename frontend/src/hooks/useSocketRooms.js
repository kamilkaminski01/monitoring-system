import { useEffect, useRef, useState } from 'react';

export const useSocketRooms = (websocketURL) => {
  const [rooms, setRooms] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    socketRef.current = new WebSocket(websocketURL);
    socketRef.current.onmessage = (event) => {
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

    return () => {
      if (socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, [websocketURL]);

  return [rooms, socketRef];
};
