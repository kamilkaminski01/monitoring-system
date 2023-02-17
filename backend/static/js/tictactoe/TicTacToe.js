const infoDiv = document.getElementById("infodiv");
const playersNumber = document.getElementById("playersNumber");
const userTurn = document.getElementById("userTurn");
const chatInput = document.getElementById("chatInput");
let elementArray = document.querySelectorAll(".space");

const tictactoeSocket = new WebSocket(socketAppUrl);
const tictactoeUsername = localStorage.getItem("username");

let boardState = ["", "", "", "", "", "", "", "", ""];
let gameState = "ON";
let player
let totalPlayers;
let currentPlayer;

elementArray.forEach(function (elem) {
  elem.addEventListener("click", function (event) {
    if (totalPlayers < 2) {
      Swal.fire("Oops...", "Wait for the second player", "warning");
    } else {
      if (currentPlayer === tictactoeUsername && gameState === "ON") {
        setText(event.currentTarget.getAttribute("data-cell-index"), player);
      } else if (gameState === "OFF") {
        Swal.fire("Game ended", "Restart the game", "warning");
      } else {
        Swal.fire("Oops...", "Not your turn", "warning");
      }
    }
  });
});

function checkGameEnd() {
  let count = 0;
  boardState.map((game) => {
    if (game !== "") {
      count++;
    }
  });
  if (count >= 9) {
    count = 0;
    tictactoeSocket.send(
      JSON.stringify({
        command: "run",
        game_state: "over"
      })
    );
  }
}

function checkWon(value, player) {
  let won = false;
  if (boardState[0] === value && boardState[1] === value && boardState[2] === value) {
    won = true;
  } else if (boardState[3] === value && boardState[4] === value && boardState[5] === value) {
    won = true;
  } else if (boardState[6] === value && boardState[7] === value && boardState[8] === value) {
    won = true;
  } else if (boardState[0] === value && boardState[3] === value && boardState[6] === value) {
    won = true;
  } else if (boardState[1] === value && boardState[4] === value && boardState[7] === value) {
    won = true;
  } else if (boardState[2] === value && boardState[5] === value && boardState[8] === value) {
    won = true;
  } else if (boardState[0] === value && boardState[4] === value && boardState[8] === value) {
    won = true;
  } else if (boardState[2] === value && boardState[4] === value && boardState[6] === value) {
    won = true;
  }
  if (won) {
    tictactoeSocket.send(
      JSON.stringify({
        command: "run",
        game_state: "won",
        player: player
      })
    );
  } else {
    checkGameEnd();
  }
}

function setText(index, value) {
  if (boardState[parseInt(index)] === "") {
    boardState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;
    tictactoeSocket.send(
      JSON.stringify({
        command: "run",
        game_state: "running",
        player: player,
        index: index,
        board_state: boardState,
      })
    );
    checkWon(value, player);
  } else {
    Swal.fire("Oops...", "You cannot fill this space", "warning");
  }
}

function setAnotherUserText(index, value) {
  boardState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}

function initializeBoard(data){
  boardState = data.board_state;
  for(let i = 0; i < boardState.length; i++)
    elementArray[i].innerHTML = boardState[i];
}

function restartTicTacToeBoardState() {
  tictactoeSocket.send(
    JSON.stringify({
      command: "restart",
      info: `${tictactoeUsername} restarted the game`,
      user: tictactoeUsername
    })
  );
}

chatInput.addEventListener("keyup", (e) => {
  chatContent(e, tictactoeSocket, tictactoeUsername);
});

tictactoeSocket.onopen = function (e) {
  onOpen(tictactoeSocket, tictactoeUsername);
};

// socket.onclose doesn't work, this eventListener gets triggered when a user refreshes or exits the page
window.addEventListener("beforeunload", function(e){
  onLeave(tictactoeSocket, tictactoeUsername);
});

tictactoeSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  onJoinedOrLeave(data, tictactoeUsername);
  chatData(data);
  checkTurnBetweenPlayers();
  if (data.command === "joined" || data.command === "restart") {
    if (data.command === "restart"){
      gameState = "ON";
      sendChatMessage(data)
      Swal.fire({
        icon: "success",
        title: "Restart",
        text: "The game has restarted",
        toast: true,
        position: "top-right"
      });
    }
    getRoomDetails(appRoomName).then((response) => {
      if (tictactoeUsername === response.players[0].username){
        player = "O";
      } else {
        player = "X";
      }
    });
    initializeBoard(data);
  }
  if (data.game_state === "won") {
    gameState = "OFF";
    if (data.player === player) {
      Swal.fire("Good job", "You won", "success");
    } else {
      Swal.fire("Sorry", "You lost", "error");
    }
  }
  if (data.game_state === "over") {
    gameState = "OFF";
    Swal.fire("Game over", "No one won", "warning");
  }
  if (data.game_state === "running" && data.player !== player) {
    setAnotherUserText(data.index, data.player);
  }
};
