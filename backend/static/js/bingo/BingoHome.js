const createRoom = document.querySelector("#createRoom");
const joinRoom = document.querySelector("#joinRoom");
const roomName = document.querySelector("#roomName");
const bingoUsername = document.querySelector("#username");
const playerLimit2 = document.querySelector("#playerLimit2").parentNode.textContent.trim();
const playerLimit3 = document.querySelector("#playerLimit3").parentNode.textContent.trim();
const playerLimit4 = document.querySelector("#playerLimit4").parentNode.textContent.trim();
const onlinerooms = document.getElementById("onlinerooms");

bingoUsername.value = localStorage.getItem("username");
const bingoOnlineRoomsSocket = new WebSocket(bingoOnlineRoomsUrl);
let bingoTotalPlayersLimit = 0

document.querySelector("#show-createRoom").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("active");
});
document.querySelector(".popup .close-btn").addEventListener("click", function () {
  document.querySelector(".popup").classList.remove("active");
});

createRoom.addEventListener("click", async function () {
  const selectedCheckbox = document.querySelector("input[type='checkbox']:checked");
  if (selectedCheckbox) {
    if (roomName.value) {
      switch (selectedCheckbox.id) {
        case "playerLimit2":
          bingoTotalPlayersLimit = parseInt(playerLimit2, 10);
          break;
        case "playerLimit3":
          bingoTotalPlayersLimit = parseInt(playerLimit3, 10);
          break;
        case "playerLimit4":
          bingoTotalPlayersLimit = parseInt(playerLimit4, 10);
          break;
      }
      await makeRoom(bingoHomeUrl, roomName, bingoTotalPlayersLimit);
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "You forgot to enter a room name",
        toast: true,
        position: "top-right"
      });
    }
  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Select the players limit",
      toast: true,
      position: "top-right"
    });
  }
});

joinRoom.addEventListener("click", async function () {
  await getInRoom(bingoHomeUrl, roomName, bingoUsername);
});

// Functions are imported from websocketRoomsUtils.js
bingoOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  checkOnlineRooms(data, "bingo");
  roomAdded(data, "bingo");
  roomDeleted(data);
};
