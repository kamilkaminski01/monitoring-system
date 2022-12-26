let player = username.charAt(0);
let socket = new WebSocket('ws://localhost:8000/ws/game/tictactoe/' + room);
let gameState = ['', '', '', '', '', '', '', '', ''];
let elementArray = document.querySelectorAll('.space');

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
    let data = {"type": "over"};
    socket.send(JSON.stringify({data}));
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
    let data = {"type": "end", "player": player};
    socket.send(JSON.stringify({data}));
    swal('Good job!', 'You won', 'success');
  }
  checkGameEnd();
}

function setText(index, value) {
  let data = {
    "player": player,
    "index": index,
    "type": 'running'
  };

  if (gameState[parseInt(index)] === '') {
    gameState[parseInt(index)] = value;
    elementArray[parseInt(index)].innerHTML = value;

    socket.send(JSON.stringify({data}));
    checkWon(value, player);
  } else {
    swal('Error', 'You cannot fill this space!', 'error');
  }
}

function setAnotherUserText(index, value) {
  gameState[parseInt(index)] = value;
  elementArray[parseInt(index)].innerHTML = value;
}

socket.onopen = function (e) {
  console.log('Socket connected');
};

socket.onmessage = function (e) {
  let data = JSON.parse(e.data);
  console.log(data);
  if (data.payLoad.type === 'end' && data.payLoad.player !== player) {
    swal('Sorry!', 'You lost', 'error');
  } else if (data.payLoad.type === 'over') {
    swal('Game over!', 'Game ended no one won', 'warning');
  } else if (data.payLoad.type === 'running' && data.payLoad.player !== player) {
    setAnotherUserText(data.payLoad.index, data.payLoad.player);
  }
};

socket.onclose = function (e) {
  console.log('Socket closed');
};
