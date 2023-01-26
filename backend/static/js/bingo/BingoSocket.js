const infoDiv = document.getElementById("infodiv");
const userNum = document.getElementById("userNum");
const userTurn = document.getElementById("userTurn");
const chatInput = document.getElementById("chatInput");
const lastStepDiv = document.getElementById("lastStepDiv");

const bingoSocketUrl = "ws://localhost:8000/ws/clicked" + window.location.pathname;
const bingoSocket = new WebSocket(bingoSocketUrl);
const bingoUsername = localStorage.getItem("username");

let gamestate = "ON";
const addmearr = [];

let allPlayers = [];
let totalPlayers;
let playerTrack = 0;
let currentPlayer;

function getLastStep(data) {
  lastStepDiv.innerHTML = `<span>Last step: <span class="prevStep">${data}</span></span>`;
}

chatInput.addEventListener("keyup", (e) => {
  chatContent(e, bingoSocket, bingoUsername);
});

bingoSocket.onopen = function (e) {
  onOpen(bingoSocket, bingoUsername);
};

bingoSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);
  onJoined(data, bingoUsername);
  chatData(data);

  if (data.command === "clicked") {
    getLastStep(data.dataset);
    checkTurn();
    const clickedDiv = document.querySelector(`[data-innernum='${data.dataset}']`);

    if (notForMeData(data, bingoUsername)) {
      const myDataSetId = parseInt(clickedDiv.dataset.id);
      if (!addmearr.includes(myDataSetId)) {
        addmearr.push(myDataSetId);
        loopItemsAndCheck();
      }
    }
    clickedDiv.classList.add("clicked");
  }

  if (data.command === "won") {
    gamestate = "OFF";
    if (notForMeData(data, bingoUsername)) {
      Swal.fire("You lost", data.info, "error");
    }
    // Swal.fire("You drew with another user", data.info, "warning");
  }
};
