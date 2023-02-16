const grid = document.querySelector(".grid");
const items = [...document.querySelector(".grid").children];
const bingodiv = document.querySelector("#bingodiv");
const infoDiv = document.getElementById("infodiv");
const playersNumber = document.getElementById("playersNumber");
const userTurn = document.getElementById("userTurn");
const chatInput = document.getElementById("chatInput");
const playersLimit = document.getElementById("playersLimit");

const bingoSocket = new WebSocket(socketAppUrl);
const bingoUsername = localStorage.getItem("username");

const bingoState = ["B", "I", "N", "G", "O", ""];
let gamestate = "ON";
let playersBingoState = [];
let keysArr = [];
let datasetArr = [];

let totalPlayers;
let currentPlayer;
let playersLimitNumber;

// All possible combinations for bingo win
let bingoWinRows = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
  [1, 7, 13, 19, 25],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [5, 10, 15, 20, 25],
  [5, 9, 13, 17, 21]
];
const originalBingoWinRows = [...bingoWinRows];

function initializeBoard() {
  for (let i = 1; i < 26; i++) {
    let b = Math.ceil(Math.random() * 25);
    if (!keysArr.includes(b))
      keysArr.push(b);
    else
      i--;
  }
  items.forEach((item, index) => {
    item.removeAttribute("class");
    item.innerHTML = keysArr[index];
    item.dataset.innernum = keysArr[index];
  });
}

function checkBingo(item) {
  const dataID = item.dataset.id;
  const innernum = item.dataset.innernum;
  const dataNumber = parseInt(dataID);
  if (datasetArr.includes(dataNumber))
    return Swal.fire("Oops..", "Already selected", "warning");
  datasetArr.push(dataNumber);
  item.classList.add("clicked");
  bingoSocket.send(
    JSON.stringify({
      command: "clicked",
      user: bingoUsername,
      dataID: dataID,
      dataset: innernum
    })
  );
  loopItemsAndCheck();
}

const handleClick = (e) => {
  if (gamestate === "OFF") {
    return Swal.fire("Game finished", "Restart to play again!", "warning");
  }
  if (totalPlayers < playersLimitNumber) {
    return Swal.fire("Oops...", "Wait for the rest of the players", "warning");
  }
  if (currentPlayer !== bingoUsername) {
    return Swal.fire("Oops..", "Not your turn!", "warning");
  }
  checkBingo(e.currentTarget);
};

items.forEach((item) => {
  item.addEventListener("click", handleClick);
});

const includesAll = (arr, values) => values.every((v) => arr.includes(v));

function successGrid(index, li) {
  setTimeout(() => {
    const doneBingoDiv = document.querySelector(`[data-id='${li}']`);
    doneBingoDiv.classList.remove("clicked");
    doneBingoDiv.classList.add("bingoSuccess");
  }, index * 80);
}

function loopItemsAndCheck() {
  for (const j of bingoWinRows) {
    if (includesAll(datasetArr, j)) {
      for (let [index, li] of j.entries()) successGrid(index, li);
      const index = bingoWinRows.indexOf(j);
      if (index > -1) bingoWinRows.splice(index, 1);
      let span = document.createElement("span");
      span.classList.add("bingoState");
      span.append(bingoState[playersBingoState.length]);
      bingodiv.append(span);
      playersBingoState.push(span.textContent);
      bingoSocket.send(
        JSON.stringify({
          command: "update_bingo_state",
          user: bingoUsername,
          players_bingo_state: playersBingoState
        })
      );
      if (playersBingoState.length === 5) {
        bingoSocket.send(
          JSON.stringify({
            command: "win",
            user: bingoUsername,
            info: `${bingoUsername} won the game`
          })
        );
      }
    }
  }
}

function getBoardState(player, boardState) {
  items.forEach((item, index) => {
    item.innerHTML = player.initial_board_state[index];
    item.dataset.innernum = player.initial_board_state[index];
    if (boardState.includes(player.initial_board_state[index].toString())) {
      item.classList.add("clicked");
      datasetArr.push(parseInt(item.dataset.id));
      loopItemsAndCheck();
    }
  });
}

function restartBingoBoardState() {
  bingoSocket.send(
    JSON.stringify({
      command: "restart",
      info: `${bingoUsername} restarted the game`,
      user: bingoUsername
    })
  );
}

chatInput.addEventListener("keyup", (e) => {
  chatContent(e, bingoSocket, bingoUsername);
});

bingoSocket.onopen = function (e) {
  onOpen(bingoSocket, bingoUsername);
  getRoomDetails(appRoomName).then((response) => {
    const players = response.players;
    const room = response.room;
    const player = players.find((p) => p.username === bingoUsername);
    const boardState = room.board_state;
    if (!player) {
      initializeBoard();
      bingoSocket.send(
        JSON.stringify({
          command: "initialize_board",
          user: bingoUsername,
          initial_board_state: keysArr
        })
      );
    } else {
      getBoardState(player, boardState);
    }
    playersLimit.textContent = room.players_limit;
    playersLimitNumber = room.players_limit;
  });
};

// socket.onclose doesn't work, this eventListener gets triggered when a user refreshes or exits the page
window.addEventListener("beforeunload", function (e) {
  onLeave(bingoSocket, bingoUsername);
});

bingoSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  onJoinedOrLeave(data, bingoUsername);
  chatData(data);
  checkTurnBetweenPlayers();
  if (data.command === "clicked") {
    const clickedDiv = document.querySelector(`[data-innernum='${data.dataset}']`);
    if (notForMeData(data, bingoUsername)) {
      const myDataSetId = parseInt(clickedDiv.dataset.id);
      if (!datasetArr.includes(myDataSetId)) {
        datasetArr.push(myDataSetId);
        loopItemsAndCheck();
      }
    }
    clickedDiv.classList.add("clicked");
  }
  if (data.command === "restart") {
    gamestate = "ON";
    datasetArr.splice(0, datasetArr.length);
    playersBingoState.splice(0, playersBingoState.length);
    keysArr.splice(0, keysArr.length);
    initializeBoard();
    bingoSocket.send(
      JSON.stringify({
        command: "initialize_board",
        user: bingoUsername,
        initial_board_state: keysArr
      })
    );
    while (bingodiv.firstChild) {
      bingodiv.removeChild(bingodiv.firstChild);
    }
    bingoWinRows = [...originalBingoWinRows];
    sendChatMessage(data);
    Swal.fire({
      icon: "success",
      title: "Restart",
      text: "The game has restarted",
      toast: true,
      position: "top-right"
    });
  }
  if (data.command === "win") {
    gamestate = "OFF";
    if (data.winners.includes(bingoUsername))
      Swal.fire("Good job", "You won!", "success");
    else
      Swal.fire("Sorry", "You lost!", "error");
    sendChatMessage(data, bingoUsername);
  }
};
