function onOpen(socket, username) {
  socket.send(
    JSON.stringify({
      command: "joined",
      info: `${username} just joined`,
      user: username
    })
  );
}

function notForMeData(data, username) {
  return data.user !== username;
}

function onJoined(data, username) {
  if (data.command === "joined") {
    allPlayers = data.all_players;
    totalPlayers = data.users_count;
    currentPlayer = allPlayers[playerTrack];
    userTurn.textContent = currentPlayer;
    userNum.textContent = data.users_count;
    if (notForMeData(data, username)) {
      infoDiv.innerHTML += `
        <div class="side-text">
        <p>${data.info}</p>
        </div>
        `;
    }
    infoDiv.scrollTop = infoDiv.scrollHeight;
  }
}
