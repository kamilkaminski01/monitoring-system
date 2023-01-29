const infoDiv = document.getElementById("infodiv");
const userNum = document.getElementById("userNum");
const userTurn = document.getElementById("userTurn");
const chatInput = document.getElementById("chatInput");
let elementArray = document.querySelectorAll(".space");

const tictactoeSocketUrl = "ws://localhost:8000/ws/clicked" + window.location.pathname;
const tictactoeSocket = new WebSocket(tictactoeSocketUrl);

const tictactoeUsername = localStorage.getItem("username");
const player = tictactoeUsername[0];
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameState = "ON";

let allPlayers = [];
let totalPlayers;
let playerTrack = 0;
let currentPlayer;

elementArray.forEach(function (elem) {
  elem.addEventListener("click", function (event) {
    if (currentPlayer === tictactoeUsername && gameState === "ON") {
      setText(event.currentTarget.getAttribute("data-cell-index"), player);
    } else if (gameState === "OFF") {
      Swal.fire("Game ended", "Restart the game!", "error");
    } else {
      Swal.fire("Oops...", "Not your turn!", "warning");
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
    gameState = "OFF";
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
    gameState = "OFF";
    tictactoeSocket.send(
      JSON.stringify({
        command: "run",
        game_state: "won",
        player: player
      })
    );
    Swal.fire("Good job", "You won!", "success");
  }
  checkGameEnd();
}

function setText(index, value) {
  if (boardState[parseInt(index)] === "" && totalPlayers > 1) {
    checkTurnBetweenTwoPlayers();
    boardState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;
    tictactoeSocket.send(
      JSON.stringify({
        command: "run",
        game_state: "running",
        player: player,
        index: index,
        boardState: boardState,
      })
    );
    checkWon(value, player);
  } else {
    Swal.fire("Oops...", "You cannot fill this space!", "error");
  }
}

function setAnotherUserText(index, value) {
  checkTurnBetweenTwoPlayers();
  boardState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}

function initializeBoard(data){
  for(let i = 0; i < boardState.length; i++)
    elementArray[i].innerHTML = data.boardState[i];
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
  if (data.command === "joined")
    initializeBoard(data)
  if (data.game_state === "won" && data.player !== player)
    Swal.fire("Sorry", "You lost!", "error");
  if (data.game_state === "over")
    Swal.fire("Game over", "No one won", "warning");
  if (data.game_state === "running" && data.player !== player)
    setAnotherUserText(data.index, data.player);
};
