import { swalCornerError } from 'utils/swal';
import axiosDefault from 'setup/axios/defaultInstance';
import { LOCAL_STORAGE } from 'utils/consts';
import { checkIfRoomExists, roomDetails } from 'utils/Rooms/roomDetails';
import { validateHomeData } from 'utils/validators';

function redirectToRoom(roomName) {
  window.location.href = `${window.location.href}/${roomName}`;
}

async function createRoom(endpoint, username, roomName, playersLimit) {
  try {
    const data = {
      room_name: roomName
    };
    if (playersLimit !== undefined) {
      data.players_limit = playersLimit;
    }
    await axiosDefault.post(endpoint, data);
    localStorage.setItem(LOCAL_STORAGE.username, username);
    redirectToRoom(roomName);
  } catch (error) {
    await swalCornerError('Room error', error);
  }
}

async function joinRoom(endpoint, username, roomName) {
  try {
    const room = roomDetails(endpoint, roomName);
    const playersAmount = room.players.length;
    const maxPlayers = room.players_limit ? room.players_limit : 2;
    playersAmount >= maxPlayers
      ? await swalCornerError('Room error', 'Room is full')
      : redirectToRoom(roomName);
  } catch (error) {
    await swalCornerError('Room error', error);
  }
}

export const handleCreateRoom = async (
  checkEndpoint,
  createEndpoint,
  username,
  roomName,
  playersLimit = null
) => {
  if (await validateHomeData(checkEndpoint, username, roomName, playersLimit)) {
    !(await checkIfRoomExists(checkEndpoint, roomName))
      ? await createRoom(createEndpoint, username, roomName, playersLimit)
      : await swalCornerError('Room error', 'Room already exists');
  }
};

export const handleJoinRoom = async (endpoint, username, roomName) => {
  if (await validateHomeData(endpoint, username, roomName)) {
    (await checkIfRoomExists(endpoint, roomName))
      ? await joinRoom(endpoint, username, roomName)
      : await swalCornerError('Room error', 'Room does not exist');
  }
};
