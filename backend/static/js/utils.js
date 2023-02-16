function menuPage() {
  window.location.href = menuPageUrl;
}

function homePage() {
  window.location.href = homeUrl;
}

function redirectToRoom(roomname) {
  localStorage.setItem("username", username.value);
  window.location.href = window.location.href + roomname;
}

window.addEventListener("load", function () {
  const message = localStorage.getItem("message");
  if (message) {
    Swal.fire("Error", message, "error");
    localStorage.removeItem("message");
  }
});

function setUsername() {
  const username = localStorage.getItem("username");
  if (!username) {
    localStorage.setItem("message", "Provide a username before connecting.");
    window.location.href = homeUrl;
    return;
  }
  const usernameDiv = document.getElementById("username");
  usernameDiv.textContent = localStorage.getItem("username");
}

async function getCheckRoom(roomname) {
  const endpoint = `${homeUrl}/api/check/${roomname}/`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  const answer = await response.json();
  return answer.room_exist;
}

async function getRoomDetails(roomname) {
  const endpoint = `${homeUrl}/api/details/${roomname}/`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    }
  });
  return await response.json();
}

function sendPlayersLimit(playersLimit, roomname) {
  let bingoSocketUrl = `${socketUrl}/${app}/${roomname}/`;
  let bingoHomeSocket = new WebSocket(bingoSocketUrl);
  bingoHomeSocket.addEventListener("open", function (event) {
    bingoHomeSocket.send(
      JSON.stringify({
        command: "room_created",
        players_limit: playersLimit
      })
    );
  });
}

async function checkUsername(roomname, username, createRoom) {
  const invalidUsername = !/^[a-zA-Z0-9-_]+$/.test(username);
  if (createRoom) {
    if (username.length > 10 || invalidUsername) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Username is invalid",
        toast: true,
        position: "top-right"
      });
      return false;
    }
  } else {
    const room = await getRoomDetails(roomname);
    const isUsernameTaken = room.players.some((player) => player.username === username);
    if (isUsernameTaken) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Username is taken",
        toast: true,
        position: "top-right"
      });
      return false;
    }
  }
  return true;
}

async function getInRoom(roomname, username) {
  if (!roomname) {
    return Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Insert a room name",
      toast: true,
      position: "top-right"
    });
  }
  const roomExists = await getCheckRoom(roomname);
  if (!roomExists) {
    Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Room doesn't exist",
      toast: true,
      position: "top-right"
    });
  } else {
    if (await checkUsername(roomname, username)) {
      redirectToRoom(roomname);
    }
  }
}

async function makeRoom(roomname, username, playersLimit) {
  const roomExists = await getCheckRoom(roomname);
  const invalidRoomName = !/^[a-zA-Z0-9-_]+$/.test(roomname);
  if (roomExists || invalidRoomName) {
    Swal.fire({
      icon: "error",
      title: "Room error",
      text: "Room name taken or its invalid",
      toast: true,
      position: "top-right"
    });
  } else {
    if (await checkUsername(roomname, username, true)) {
      redirectToRoom(roomname);
      if (playersLimit) {
        sendPlayersLimit(playersLimit, roomname);
      }
    }
  }
}

function checkTurnBetweenPlayers() {
  getRoomDetails(appRoomName).then((response) => {
    playersLimitNumber = typeof playersLimitNumber !== 'undefined' ? playersLimitNumber : 2;
    const enoughPlayers = totalPlayers >= playersLimitNumber;
    const players = response.players;
    const allPlayersActive = players.every(player => player.is_active);
    if (allPlayersActive && enoughPlayers) {
      currentPlayer = response.players_turn;
      userTurn.textContent = `${currentPlayer}'s turn`;
      userTurn.classList.remove("not-enough-players");
    } else {
      userTurn.textContent = "not enough players";
      userTurn.classList.add("not-enough-players");
    }
  });
}
