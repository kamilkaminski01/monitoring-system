const createRoom = document.querySelector("#createRoom");
const joinRoom = document.querySelector("#joinRoom");
const roomName = document.querySelector("#roomName");
const bingoUsername = document.querySelector("#username");
const playerLimit2 = document.querySelector("#playerLimit2");
const playerLimit3 = document.querySelector("#playerLimit3");
const playerLimit4 = document.querySelector("#playerLimit4");
const onlinerooms = document.getElementById("onlinerooms");

bingoUsername.value = localStorage.getItem("username");
const bingoOnlineRoomsSocket = new WebSocket(socketRoomsUrl);

document.querySelector("#show-createRoom").addEventListener("click", function () {
  document.querySelector(".popup").classList.add("active");
});
document.querySelector(".popup .close-btn").addEventListener("click", function () {
  document.querySelector(".popup").classList.remove("active");
});

const checkboxes = [playerLimit2, playerLimit3, playerLimit4];
for (const checkbox of checkboxes) {
  checkbox.addEventListener("change", function () {
    for (const otherCheckbox of checkboxes) {
      if (otherCheckbox !== this) {
        otherCheckbox.checked = false;
      }
    }
  });
}

createRoom.addEventListener("click", async function () {
  const selectedPlayersLimit = document.querySelector("input[type='checkbox']:checked");
  if (selectedPlayersLimit) {
    if (roomName.value) {
      await makeRoom(roomName.value, bingoUsername.value, selectedPlayersLimit.value);
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
  await getInRoom(roomName.value, bingoUsername.value);
});

// Functions are imported from websocketRoomsUtils.js
bingoOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  roomAdded(data);
  roomDeleted(data);
  checkOnlineRooms(data);
};
