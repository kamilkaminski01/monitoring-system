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
    tictactoeSocket.send(
      JSON.stringify({
        type: "over"
      })
    );
    Swal.fire("Game over", "Game ended no one won", "warning");
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
        type: "won",
        player: player
      })
    );
    Swal.fire("Good job", "You won!", "success");
  }
  checkGameEnd();
}

function setText(index, value) {
  if (boardState[parseInt(index)] === "") {
    checkTurn();
    boardState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;
    tictactoeSocket.send(
      JSON.stringify({
        player: player,
        index: index,
        type: "running"
      })
    );
    checkWon(value, player);
  } else {
    Swal.fire("Oops...", "You cannot fill this space!", "error");
  }
}

function setAnotherUserText(index, value) {
  checkTurn();
  boardState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}

chatInput.addEventListener("keyup", (e) => {
  chatContent(e, tictactoeSocket, tictactoeUsername);
});

tictactoeSocket.onopen = function (e) {
  onOpen(tictactoeSocket, tictactoeUsername);
};

tictactoeSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  onJoined(data, tictactoeUsername);
  chatData(data);

  try {
    if (data.payLoad.type === "won" && data.payLoad.player !== player) {
      gameState = "OFF";
      Swal.fire("Sorry", "You lost!", "error");
    } else if (data.payLoad.type === "over") {
      Swal.fire("Game over", "Game ended, no one won", "warning");
    } else if (data.payLoad.type === "running" && data.payLoad.player !== player) {
      setAnotherUserText(data.payLoad.index, data.payLoad.player);
    }
  } catch (error) {
    console.log(error);
  }
};
