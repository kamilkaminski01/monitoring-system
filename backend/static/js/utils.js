const menuPageURL = "http://localhost:3000/";
const tictactoeHomeURL = "http://localhost:8000/tictactoe/";
const bingoHomeURL = "http://localhost:8000/bingo/";

function menuPage() {
  window.location.href = menuPageURL;
}

function tictactoeHomePage() {
  window.location.href = tictactoeHomeURL;
}

function bingoHomePage() {
  window.location.href = bingoHomeURL;
}

function refreshPage() {
  window.location.reload();
}

function setUsername(username) {
  if (!username) {
    const name = prompt("Please give a username:");
    localStorage.setItem("username", name);
  }
  const userdiv = document.getElementById("userdiv");
  userdiv.textContent = localStorage.getItem("username");
}

function getInRoom(roomName, username) {
  if (!/^[a-zA-Z0-9-_]+$/.test(roomName.value)) {
    Swal.fire("Error", "Use underscore and alphanumeric room names only!", "error");
  } else {
    if (username.value.length < 3) {
      Swal.fire("Error", "Username must be larger than 3 characters", "error");
    } else {
      localStorage.setItem("username", username.value);
      window.location.href = window.location.href + roomName.value;
    }
  }
}

async function makeRoom(url, roomName, username) {
  try {
    const res = await fetch(`${url}room/check_room/${roomName.value}/`, {
      method: "GET"
    });
    const r = await res.json();
    if (r.room_exist) {
      Swal.fire("Room name taken", "Please choose other or join this room!", "error");
    } else {
      getInRoom(roomName, username);
    }
  } catch (error) {
    console.log(error);
  }
}

function checkTurn() {
  playerTrack === totalPlayers - 1 ? (playerTrack = 0) : playerTrack++;
  currentPlayer = allPlayers[playerTrack];
  userTurn.textContent = currentPlayer;
}

function checkTurnBetweenTwoPlayers() {
  playerTrack = playerTrack === 0 ? 1 : 0;
  currentPlayer = allPlayers[playerTrack];
  userTurn.textContent = currentPlayer;
}
