import { swalCornerError } from 'utils/swal';
import { checkIfRoomExists, postRoomDetails, roomDetails } from 'utils/roomDetails';
import { validateHomeData } from 'utils/validators';

function redirectToRoom(roomName) {
  window.location.href = `${window.location.href}/${roomName}`;
}

async function createRoom(endpoint, username, roomName, playersLimit) {
  try {
    const data = {
      room_name: roomName,
      player: username
    };
    if (playersLimit !== undefined) {
      data.players_limit = playersLimit;
    }
    await postRoomDetails(endpoint, roomName, data);
    redirectToRoom(roomName);
  } catch (error) {
    swalCornerError('Room error', error);
  }
}

async function joinRoom(detailsEndpoint, createEndpoint, username, roomName) {
  try {
    const data = {
      room_name: roomName,
      player: username
    };
    const room = await roomDetails(detailsEndpoint, roomName, true);
    const playersAmount = room.players.length;
    const maxPlayers = room.players_limit ? room.players_limit : 2;

    if (playersAmount >= maxPlayers) {
      swalCornerError('Room error', 'Room is full');
    } else {
      await postRoomDetails(createEndpoint, roomName, data);
      redirectToRoom(roomName);
    }
  } catch (error) {
    swalCornerError('Room error', error);
  }
}

export const handleCreateRoom = async (
  checkEndpoint,
  createEndpoint,
  username,
  roomName,
  playersLimit = null
) => {
  if (validateHomeData(checkEndpoint, username, roomName, playersLimit)) {
    !(await checkIfRoomExists(checkEndpoint, roomName))
      ? await createRoom(createEndpoint, username, roomName, playersLimit)
      : swalCornerError('Room error', 'Room already exists');
  }
};

export const handleJoinRoom = async (
  checkEndpoint,
  detailsEndpoint,
  createEndpoint,
  username,
  roomName
) => {
  if (validateHomeData(checkEndpoint, username, roomName)) {
    (await checkIfRoomExists(checkEndpoint, roomName))
      ? await joinRoom(detailsEndpoint, createEndpoint, username, roomName)
      : swalCornerError('Room error', 'Room does not exist');
  }
};
