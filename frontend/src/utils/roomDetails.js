import axiosAuth from 'setup/axios/authInstance';
import axiosDefault from 'setup/axios/defaultInstance';
import { generatePath } from 'react-router-dom';

export async function checkIfRoomExists(endpoint, roomName) {
  const roomExists = await roomDetails(endpoint, roomName, false);
  return !!roomExists;
}

export async function roomDetails(endpoint, roomName, returnData = false) {
  try {
    const response = await axiosDefault.get(generatePath(endpoint, { room_name: roomName }));
    return returnData ? response.data : response.data.room_exist;
  } catch (error) {}
}

export async function postRoomDetails(endpoint, roomName, data) {
  try {
    await axiosDefault.post(generatePath(endpoint, { room_name: roomName }), data);
  } catch (error) {
    return error;
  }
}

export async function putRoomDetails(endpoint, roomName, data) {
  try {
    await axiosDefault.put(generatePath(endpoint, { room_name: roomName }), data);
  } catch (error) {
    return error;
  }
}

export async function putRoomDetailsPlayer(endpoint, roomName, username, data) {
  try {
    await axiosDefault.put(generatePath(endpoint, { room_name: roomName, username }), data);
  } catch (error) {
    return error;
  }
}

export async function getAuthRoomDetails(endpoint, roomName) {
  try {
    const response = await axiosAuth.get(generatePath(endpoint, { room_name: roomName }));
    return response.data;
  } catch (error) {}
}

export async function deleteAuthRoom(endpoint, roomName) {
  try {
    const response = await axiosAuth.delete(generatePath(endpoint, { room_name: roomName }));
    return response.data;
  } catch (error) {}
}
