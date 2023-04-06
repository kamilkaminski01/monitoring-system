import { swalCornerError } from 'utils/swal';
import {
  checkIfGameExists,
  checkIfRoomExists,
  postGameDetails,
  postRoomDetails,
  roomDetails
} from 'utils/requests';
import { validateCreateGameData, validateHomeData } from 'utils/validators';

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
    redirectToLocation(roomName);
  } catch (error) {}
}

async function createGame(endpoint, username) {
  try {
    await postGameDetails(endpoint, username);
    redirectToLocation(username);
  } catch (error) {}
}

async function joinRoom(detailsEndpoint, createEndpoint, username, roomName) {
  try {
    const data = {
      room_name: roomName,
      player: username
    };
    const room = await roomDetails(detailsEndpoint, roomName, true);
    if (await checkRoomPlayersAndLimit(room, username)) {
      const isPlayerCreated = room.players.some((player) => player.username === username);
      if (!isPlayerCreated) await postRoomDetails(createEndpoint, roomName, data);
      redirectToLocation(roomName);
    }
  } catch (error) {}
}

async function checkRoomPlayersAndLimit(room, username) {
  const playersLimit = room.players_limit || (room.game_state ? 2 : 5);
  const { players } = room;
  const player = players.find((player) => player.username === username);
  if (players.length >= playersLimit) {
    if (player && !player.is_active) {
      return true;
    }
    swalCornerError('Room error', 'Room is full');
    return false;
  }
  if (player && player.is_active) {
    swalCornerError('Username error', 'Username is taken');
    return false;
  }
  return true;
}

export function redirectToLocation(location) {
  window.location.href = `${window.location.href}/${location}`;
}

export const handleCreateRoom = async (
  checkEndpoint,
  createEndpoint,
  username,
  roomName,
  playersLimit = null
) => {
  if (validateHomeData(username, roomName, playersLimit)) {
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
  if (validateHomeData(username, roomName)) {
    (await checkIfRoomExists(checkEndpoint, roomName))
      ? await joinRoom(detailsEndpoint, createEndpoint, username, roomName)
      : swalCornerError('Room error', 'Room does not exist');
  }
};

export const handleCreateGame = async (checkEndpoint, createEndpoint, username) => {
  if (validateCreateGameData(username)) {
    !(await checkIfGameExists(checkEndpoint, username))
      ? await createGame(createEndpoint, username)
      : swalCornerError('Game error', 'This user is already in a game');
  }
};
