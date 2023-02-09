function menuPage() {
  window.location.href = menuPageUrl;
}

function tictactoeHomePage() {
  window.location.href = tictactoeHomeUrl;
}

function bingoHomePage() {
  window.location.href = bingoHomeUrl;
}

async function getCheckRoom(url, roomname) {
  const endpoint = `${url}/check_room/${roomname}/`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  const answer = await response.json();
  return answer.room_exist;
}

async function getRoomDetails(url, roomname){
  const endpoint = `${url}/details/${roomname}/`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
  return await response.json()
}

function sendPlayersLimit(playersLimit, roomname) {
  let bingoSocketUrl = `${socketUrl}/bingo/${roomname}/`;
  let bingoHomeSocket = new WebSocket(bingoSocketUrl);
  bingoHomeSocket.addEventListener("open", function (event) {
    bingoHomeSocket.send(
      JSON.stringify({
        command: "room_created",
        players_limit: playersLimit,
      })
    );
  });
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
  const invalidUsername = !/^[a-zA-Z0-9-_]+$/.test(username);
  if (room.players.includes(username) || username.length > 10 || invalidUsername) {
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

function redirectToRoom(roomname) {
  localStorage.setItem("username", username.value);
  window.location.href = window.location.href + roomname;
}

async function getInRoom(url, roomname, username) {
  const roomExists = await getCheckRoom(url, roomname);
  if (!roomExists) {
    Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Room doesn't exist",
      toast: true,
      position: "top-right"
    });
  } else {
    if (await checkUsername(url, roomname, username)){
      redirectToRoom(roomname);
    }
  }
}

async function makeRoom(url, roomname, playersLimit) {
  const roomExists = await getCheckRoom(url, roomname);
  const invalidRoomName = !/^[a-zA-Z0-9-_]+$/.test(roomname);
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
    if (playersLimit) {
      sendPlayersLimit(playersLimit, roomname);
    }
  }
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
      userTurn.textContent = "not enough players";
    }
  });
}
