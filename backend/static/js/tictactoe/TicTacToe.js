const infoDiv = document.getElementById('infodiv');
const userNum = document.getElementById('userNum');
const userTurn = document.getElementById('userTurn');
const chatInput = document.getElementById('chatInput');
let elementArray = document.querySelectorAll('.space');

const tictactoeSocketUrl = 'ws://localhost:8000/ws/clicked' + window.location.pathname;
const tictactoeSocket = new WebSocket(tictactoeSocketUrl);

const tictactoeUsername = localStorage.getItem('username');
const player = tictactoeUsername[0]
let boardState = ['', '', '', '', '', '', '', '', ''];
let gameState = 'ON';

let allPlayers = [];
let totalPlayers;
let playerTrack = 0;
let currentPlayer;

elementArray.forEach(function (elem) {
  elem.addEventListener('click', function (event) {
    if (currentPlayer === tictactoeUsername && gameState === 'ON') {
      setText(event.path[0].getAttribute('data-cell-index'), player);
    } else if (gameState === 'OFF'){
      swal('Game Ended', 'Restart the game', 'error');
    } else {
      swal('Oops...', 'Not your turn!', 'warning');
    }
  });
});

function checkGameEnd() {
  let count = 0;
  boardState.map((game) => {
    if (game !== '') {
      count++;
    }
  });
  if (count >= 9) {
    tictactoeSocket.send(
      JSON.stringify({
        "type": "over"
      })
    );
    swal('Game over!', 'Game ended no one won', 'warning');
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
    gameState = 'OFF';
    tictactoeSocket.send(
      JSON.stringify({
        "type": "won",
        "player": player
      })
    );
    swal('Good job!', 'You won', 'success');
  }
  checkGameEnd();
}

function checkTurn() {
  playerTrack === totalPlayers - 1 ? (playerTrack = 0) : playerTrack++;
  currentPlayer = allPlayers[playerTrack];
  userTurn.textContent = currentPlayer
}

function setText(index, value) {
  if (boardState[parseInt(index)] === '') {
    checkTurn()
    boardState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;
    tictactoeSocket.send(
      JSON.stringify({
        "player": player,
        "index": index,
        "type": 'running'
      })
    );
    checkWon(value, player);
  } else {
    swal('Error', 'You cannot fill this space!', 'error');
  }
}

function setAnotherUserText(index, value) {
  checkTurn()
  boardState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}

function notForMe(data) {
  return data.user !== tictactoeUsername;
}

tictactoeSocket.onopen = function (e) {
    tictactoeSocket.send(
    JSON.stringify({
      command: 'joined',
      info: `${tictactoeUsername} just joined`,
      user: tictactoeUsername
    })
  );
};

tictactoeSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  if (data.command === 'joined'){
    allPlayers = data.all_players;
    totalPlayers = data.users_count;
    currentPlayer = allPlayers[playerTrack];
    userTurn.textContent = currentPlayer
    userNum.textContent = data.users_count;
    if (notForMe(data)){
      infoDiv.innerHTML +=
      `
        <div class='side-text'>
          <p style='font-size:15px;'>${data.info}</p>
        </div>
      `;
    }
    infoDiv.scrollTop = infoDiv.scrollHeight;
  }

  if (data.command === 'chat') {
    infoDiv.innerHTML +=
    `
      <div class="side-text">
        <p>${data.chat}
          <span class="float-right"> - ${data.user}</span>
        </p>
      </div>
    `;
    infoDiv.scrollTop = infoDiv.scrollHeight;
  }

  if (data.payLoad.type === 'won' && data.payLoad.player !== player) {
    gameState = 'OFF';
    swal('Sorry!', 'You lost', 'error');
  } else if (data.payLoad.type === 'over') {
    swal('Game over!', 'Game ended no one won', 'warning');
  } else if (data.payLoad.type === 'running' && data.payLoad.player !== player) {
    setAnotherUserText(data.payLoad.index, data.payLoad.player);
  }
};

tictactoeSocket.onclose = function (e) {
  // console.log('Socket closed');
};

chatInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    if (!chatInput.value.trim()) {
      return swal('Oops...', 'Your message can not be empty!', 'error');
    }
    tictactoeSocket.send(
      JSON.stringify({
        user: tictactoeUsername,
        chat: chatInput.value,
        command: 'chat'
      })
    );
    chatInput.value = '';
  }
});
