const createRoom = document.querySelector("#create_room");
const joinRoom = document.querySelector("#join_room");
const roomName = document.querySelector("#room_name");
const tictactoeUsername = document.querySelector("#username");

const onlinerooms = document.getElementById("onlinerooms");
const tictactoeHomeUrl = "http://localhost:8000/tictactoe/";
const tictactoeOnlineRoomsSocketUrl = "ws://localhost:8000/ws/online-rooms/tictactoe/";
const tictactoeOnlineRoomsSocket = new WebSocket(tictactoeOnlineRoomsSocketUrl);

tictactoeUsername.value = localStorage.getItem("username") || "";

createRoom.addEventListener("click", async function () {
  await makeRoom(tictactoeHomeUrl, roomName, tictactoeUsername);
});

joinRoom.addEventListener("click", function () {
  getInRoom(roomName, tictactoeUsername);
});

// Functions are imported from websocketRoomsUtils.js
tictactoeOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  checkOnlineRooms(data, "tictactoe");
  roomAdded(data, "tictactoe");
  roomDeleted(data);
};
