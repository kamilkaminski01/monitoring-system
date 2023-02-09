function menuPage() {
  window.location.href = menuPageUrl;
}

function tictactoeHomePage() {
  window.location.href = tictactoeHomeUrl;
}

function bingoHomePage() {
  window.location.href = bingoHomeUrl;
}

async function checkRoom(url, roomname) {
  const response = await fetch(`${url}/check_room/${roomname.value}/`, {method: "GET"});
  const answer = await response.json();
  return answer.room_exist;
}

async function getRoomDetails(url, roomname){
  const response = await fetch(`${url}/details/${roomname}/`, {method: "GET"});
  return await response.json()
}

function setUsername() {
  const username = localStorage.getItem("username");
  const url = window.location;
  if (url.pathname.includes("bingo")) {
    if (!username) {
      localStorage.setItem("message", "Provide a username before connecting.");
      window.location.href = bingoHomeUrl;
      return;
    }
  }
  if (url.pathname.includes("tictactoe")) {
    if (!username) {
      localStorage.setItem("message", "Provide a username before connecting.");
      window.location.href = tictactoeHomeUrl;
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
  const room = await getRoomDetails(url, roomname)
  const invalidUsername = !/^[a-zA-Z0-9-_]+$/.test(username.value);
  if (room.players.includes(username.value) || username.value.length > 10 || invalidUsername) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Username taken or its invalid",
      toast: true,
      position: "top-right"
    });
    return false;
  }
  return true;
}

function sendPlayersLimit(bingoTotalPlayersLimit, roomname) {
  let bingoSocketUrl = `${socketUrl}/bingo/${roomname.value}/`;
  let bingoHomeSocket = new WebSocket(bingoSocketUrl);
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

async function getInRoom(url, roomname, username) {
  const roomExists = await checkRoom(url, roomname);
  if (!roomExists) {
    Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Room doesn't exist",
      toast: true,
      position: "top-right"
    });
  } else {
    if (await checkUsername(url, roomname.value, username)){
      redirectToRoom(roomname);
    }
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

function checkTurnBetweenPlayers() {
  const url = window.location;
  const splitUrl = url.pathname.split("/");
  const app = splitUrl[1];
  const roomName = splitUrl[2];
  getRoomDetails(`${url.origin}/${app}`, roomName).then(({players, players_turn}) => {
    if (players.length >= 2 && players_turn.is_active !== false){
      totalPlayers = players.length
      currentPlayer = players_turn.username
      userTurn.textContent = `${currentPlayer}'s turn`;
    } else {
      totalPlayers = players.length
      userTurn.textContent = "Not enough players";
    }
  });
}
