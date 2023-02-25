import axiosDefault from 'setup/axios/defaultInstance';
import { generatePath } from 'react-router-dom';

export async function roomDetails(endpoint, roomName, returnData = false) {
  try {
    const response = await axiosDefault.get(generatePath(endpoint, { room_name: roomName }));
    return returnData ? response.data : response.data.room_exist;
  } catch (error) {
    return error;
  }
}

export async function checkIfRoomExists(endpoint, roomName) {
  const roomExists = await roomDetails(endpoint, roomName, false);
  return !!roomExists;
}
