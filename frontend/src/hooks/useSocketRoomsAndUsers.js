import { useState } from 'react'
import useWebSocket from 'react-use-websocket'

export const useSocketRoomsAndUsers = (websocketURL) => {
  const [rooms, setRooms] = useState([])
  const [users, setUsers] = useState([])

  useWebSocket(websocketURL, {
    onMessage: (message) => {
      const data = JSON.parse(message.data)
      switch (data.command) {
        case 'online_rooms':
          setRooms(data.online_rooms)
          break
        case 'room_added':
          setRooms((prevState) => {
            if (prevState.some((room) => room.room_id === data.room_id)) {
              return prevState
            } else {
              return [...prevState, { room_id: data.room_id, room_name: data.room_name }]
            }
          })
          break
        case 'room_deleted':
          setRooms((prevState) => prevState.filter((room) => room.room_id !== data.room_id))
          break
        case 'online_users':
          setUsers(data.online_users)
          break
        case 'user_added':
          setUsers((prevState) => {
            if (prevState.some((user) => user.username === data.username)) {
              return prevState
            } else {
              return [...prevState, { username: data.username }]
            }
          })
          break
        case 'user_deleted':
          setUsers((prevState) => prevState.filter((user) => user.username !== data.username))
          break
      }
    }
  })

  return [rooms, users]
}
