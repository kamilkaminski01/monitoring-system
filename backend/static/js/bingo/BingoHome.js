const createRoom = document.querySelector("#createRoom");
const joinRoom = document.querySelector("#joinRoom");
const roomName = document.querySelector("#roomName");
const bingoUsername = document.querySelector("#username");

const onlinerooms = document.getElementById("onlinerooms");
const bingoHomeUrl = "http://localhost:8000/bingo/";
const bingoOnlineRoomsUrl = "ws://localhost:8000/ws/online-rooms/bingo/";
const bingoOnlineRoomsSocket = new WebSocket(bingoOnlineRoomsUrl);

bingoUsername.value = localStorage.getItem("username") || "";

createRoom.addEventListener("click", async function () {
  await makeRoom(bingoHomeUrl, roomName, bingoUsername);
});

joinRoom.addEventListener("click", function () {
  getInRoom(roomName, bingoUsername);
});

// Functions are imported from websocketRoomsUtils.js
bingoOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  checkOnlineRooms(data, "bingo");
  roomAdded(data, "bingo");
  roomDeleted(data);
};
