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
    if (
      (await checkRoomLimit(detailsEndpoint, roomName)) &&
      (await checkRoomPlayers(detailsEndpoint, roomName, username))
    ) {
      await postRoomDetails(createEndpoint, roomName, data);
      redirectToLocation(roomName);
    }
  } catch (error) {}
}

async function checkRoomPlayers(endpoint, roomName, username) {
  const room = await roomDetails(endpoint, roomName, true);
  const isUsernameTaken = room.players.some((player) => player.username === username);
  if (isUsernameTaken) {
    await swalCornerError('Username error', 'Username is taken');
    return false;
  } else {
    return true;
  }
}

export function redirectToLocation(location) {
  window.location.href = `${window.location.href}/${location}`;
}

export async function checkRoomLimit(endpoint, roomName) {
  const room = await roomDetails(endpoint, roomName, true);
  const playersAmount = room.players.length;
  const maxPlayers = room.players_limit ? room.players_limit : 2;
  if (playersAmount >= maxPlayers) {
    await swalCornerError('Room error', 'Room is full');
    return false;
  } else {
    return true;
  }
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
