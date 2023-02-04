const menuPageURL = "http://localhost:3000/";
const tictactoeHomeURL = "http://localhost:8000/tictactoe/";
const bingoHomeURL = "http://localhost:8000/bingo/";
let bingoSocketURL = "ws://localhost:8000/ws/clicked/bingo";

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

function setUsername() {
  const username = localStorage.getItem("username");
  const url = window.location;
  if (url.pathname.includes("bingo")) {
    if (!username) {
      localStorage.setItem(
        "message",
        "Provide a username before connecting or your username is taken."
      );
      window.location.href = bingoHomeURL;
      return;
    }
  }
  if (url.pathname.includes("tictactoe")) {
    if (!username) {
      localStorage.setItem(
        "message",
        "Provide a username before connecting or your username is taken."
      );
      window.location.href = tictactoeHomeURL;
      return;
    }
  }
  const userdiv = document.getElementById("userdiv");
  userdiv.textContent = localStorage.getItem("username");
}

window.addEventListener("load", function () {
  const message = localStorage.getItem("message");
  if (message) {
    Swal.fire("Error", message, "error");
    localStorage.removeItem("message");
  }
});

async function checkUsername(url, roomname, username) {
  const response = await fetch(`${url}players/${roomname.value}/`, {
    method: "GET"
  });
  const players = await response.json();
  if (players.players.includes(username.value) || username.value.length > 10) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Username taken or its length is bigger than 10",
      toast: true,
      position: "top-right"
    });
    return false;
  }
  return true;
}

function sendPlayersLimit(bingoTotalPlayersLimit, roomname) {
  bingoSocketURL = `${bingoSocketURL}/${roomname.value}/`;
  let bingoHomeSocket = new WebSocket(bingoSocketURL);
  bingoHomeSocket.addEventListener("open", function (event) {
    bingoHomeSocket.send(
      JSON.stringify({
        command: "room_created",
        players_limit: bingoTotalPlayersLimit,
        room_name: roomname.value
      })
    );
  });
}

function redirectToRoom(roomname) {
  localStorage.setItem("username", username.value);
  window.location.href = window.location.href + roomname.value;
}

async function checkRoom(url, roomname) {
  const response = await fetch(`${url}check_room/${roomname.value}/`, {
    method: "GET"
  });
  const answer = await response.json();
  return answer.room_exist;
}

async function getInRoom(url, roomname, username) {
  const roomExists = await checkRoom(url, roomname);
  if (!roomExists) {
    Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Room doesn't exist, create it",
      toast: true,
      position: "top-right"
    });
  } else {
    if (await checkUsername(url, roomname, username)) redirectToRoom(roomname);
  }
}

async function makeRoom(url, roomname, bingoTotalPlayersLimit) {
  const roomExists = await checkRoom(url, roomname);
  const invalidRoomName = !/^[a-zA-Z0-9-_]+$/.test(roomname.value);
  if (roomExists || invalidRoomName) {
    Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Room name taken or its invalid!",
      toast: true,
      position: "top-right"
    });
  } else {
    redirectToRoom(roomname);
    if (bingoTotalPlayersLimit) {
      sendPlayersLimit(bingoTotalPlayersLimit, roomname);
    }
  }
}

function checkTurnWithLimit(playersLimitNumber) {
  playerTrack = (playerTrack + 1) % playersLimitNumber;
  currentPlayer = allPlayers[playerTrack];
  userTurn.textContent = currentPlayer;
}

function checkTurnBetweenTwoPlayers() {
  playerTrack = playerTrack === 0 ? 1 : 0;
  currentPlayer = allPlayers[playerTrack];
  userTurn.textContent = currentPlayer;
}
