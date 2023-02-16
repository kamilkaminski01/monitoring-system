const createRoom = document.querySelector("#create_room");
const joinRoom = document.querySelector("#join_room");
const roomName = document.querySelector("#room_name");
const tictactoeUsername = document.querySelector("#username");
const onlinerooms = document.getElementById("onlinerooms");

const tictactoeOnlineRoomsSocket = new WebSocket(socketRoomsUrl);

tictactoeUsername.value = localStorage.getItem("username") || "";

createRoom.addEventListener("click", async function () {
  await makeRoom(roomName.value, tictactoeUsername.value);
});

joinRoom.addEventListener("click", async function () {
  await getInRoom(roomName.value, tictactoeUsername.value);
});

// Functions are imported from websocketRoomsUtils.js
tictactoeOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  roomAdded(data);
  roomDeleted(data);
  checkOnlineRooms(data);
};
