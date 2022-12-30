const infoDiv = document.getElementById('infodiv');
const chatInput = document.getElementById('chatInput');
let elementArray = document.querySelectorAll('.space');

const socketUrl = 'ws://localhost:8000/ws/clicked' + window.location.pathname;
const socket = new WebSocket(socketUrl);

const tictactoeUsername = localStorage.getItem('username');
const player = tictactoeUsername[0]
let gameState = ['', '', '', '', '', '', '', '', ''];


elementArray.forEach(function (elem) {
  elem.addEventListener('click', function (event) {
    setText(event.path[0].getAttribute('data-cell-index'), player);
  });
});

function checkGameEnd() {
  let count = 0;
  gameState.map((game) => {
    if (game !== '') {
      count++;
    }
  });
  if (count >= 9) {
    socket.send(
      JSON.stringify({
        "type": "over"
      })
    );
    swal('Game over!', 'Game ended no one won', 'warning');
  }
}

function checkWon(value, player) {
  let won = false;
  if (gameState[0] === value && gameState[1] === value && gameState[2] === value) {
    won = true;
  } else if (gameState[3] === value && gameState[4] === value && gameState[5] === value) {
    won = true;
  } else if (gameState[6] === value && gameState[7] === value && gameState[8] === value) {
    won = true;
  } else if (gameState[0] === value && gameState[3] === value && gameState[6] === value) {
    won = true;
  } else if (gameState[1] === value && gameState[4] === value && gameState[7] === value) {
    won = true;
  } else if (gameState[2] === value && gameState[5] === value && gameState[8] === value) {
    won = true;
  } else if (gameState[0] === value && gameState[4] === value && gameState[8] === value) {
    won = true;
  } else if (gameState[2] === value && gameState[4] === value && gameState[6] === value) {
    won = true;
  }

  if (won) {
    socket.send(
      JSON.stringify({
        "type": "won",
        "player": player
      })
    );
    swal('Good job!', 'You won', 'success');
  }
  checkGameEnd();
}

function setText(index, value) {
  if (gameState[parseInt(index)] === '') {
    gameState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;

    socket.send(
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
  gameState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}

function notForMe(data) {
  return data.user !== tictactoeUsername;
}

socket.onopen = function (e) {
    socket.send(
    JSON.stringify({
      command: 'joined',
      info: `${tictactoeUsername} just joined`,
      user: tictactoeUsername
    })
  );
};

socket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  // console.log(data);

  if (data.command === 'joined'){
    if (notForMe(data)){
      infoDiv.innerHTML += `
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
        <p >${data.chat}
        <span class="float-right"> - ${data.user}</span>
        </p>
     </div>
    `;
    infoDiv.scrollTop = infoDiv.scrollHeight;
  }

  if (data.payLoad.type === 'won' && data.payLoad.player !== player) {
    swal('Sorry!', 'You lost', 'error');
  } else if (data.payLoad.type === 'over') {
    swal('Game over!', 'Game ended no one won', 'warning');
  } else if (data.payLoad.type === 'running' && data.payLoad.player !== player) {
    setAnotherUserText(data.payLoad.index, data.payLoad.player);
  }
};

socket.onclose = function (e) {
  // console.log('Socket closed');
};

chatInput.addEventListener('keyup', (e) => {
  if (e.key === '13' || e.key === 'Enter') {
    if (!chatInput.value.trim()) {
      return swal('Oops...', 'Your message can not be empty!', 'error');
    }
    socket.send(
      JSON.stringify({
        user: tictactoeUsername,
        chat: chatInput.value,
        command: 'chat'
      })
    );
    chatInput.value = '';
  }
});
