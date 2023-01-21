const infoDiv = document.getElementById('infodiv');
const userNum = document.getElementById('userNum');
const userTurn = document.getElementById('userTurn');
const chatInput = document.getElementById('chatInput');

const bingoSocketUrl = 'ws://localhost:8000/ws/clicked' + window.location.pathname;
const bingoSocket = new WebSocket(bingoSocketUrl);
const bingoUsername = localStorage.getItem('username');

let gamestate = 'ON';
const addmearr = [];

let allPlayers = [];
let totalPlayers;
let playerTrack = 0;
let currentPlayer;


bingoSocket.onopen = function (e) {
  bingoSocket.send(
    JSON.stringify({
      command: 'joined',
      info: `${bingoUsername} just joined`,
      user: bingoUsername
    })
  );
};

function notForMe(data) {
  return data.user !== bingoUsername;
}

bingoSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  const command = data.command;

  if (command === 'joined') {
    allPlayers = data.all_players;
    totalPlayers = data.users_count;
    currentPlayer = allPlayers[playerTrack];
    userTurn.textContent = currentPlayer
    userNum.textContent = data.users_count;
    if (notForMe(data)) {
      infoDiv.innerHTML +=
        `
          <div class='side-text'>
            <p style='font-size:12px;'>${data.info}</p>
          </div>
        `;
    }
    infoDiv.scrollTop = infoDiv.scrollHeight;
  }
  if (command === 'clicked') {
    getLastStep(data.dataset);
    checkTurn();
    const clickedDiv = document.querySelector(`[data-innernum='${data.dataset}']`);

    if (notForMe(data)) {
      const myDataSetId = parseInt(clickedDiv.dataset.id);
      if (!addmearr.includes(myDataSetId)) {
        addmearr.push(myDataSetId);
        loopItemsAndCheck();
      }
    }
    clickedDiv.classList.add('clicked');
  }

  if (command === 'won') {
    gamestate = 'OFF';
    if (notForMe(data)) {
      Swal.fire('You Lost', data.info, 'error');
    }
  }

  if (command === 'chat') {
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
};

function checkTurn() {
  playerTrack === totalPlayers - 1 ? (playerTrack = 0) : playerTrack++;
  currentPlayer = allPlayers[playerTrack];
  userTurn.textContent = currentPlayer
}

chatInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
    if (!chatInput.value.trim()) {
      return Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Your message can not be empty!',
        toast: true,
        position: 'top-right'
      });
    }
    bingoSocket.send(
      JSON.stringify({
        user: bingoUsername,
        chat: chatInput.value,
        command: 'chat'
      })
    );
    chatInput.value = '';
  }
});

function getLastStep(data) {
  const lastStepDiv = document.getElementById('lastStepDiv');
  lastStepDiv.innerHTML = `<span>Last Step : <span class="prevStep">${data}</span></span>`;
}
