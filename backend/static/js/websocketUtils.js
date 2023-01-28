function notForMeData(data, username) {
  return data.user !== username;
}

function sendChatMessage(data, username){
  if (notForMeData(data, username)) {
      infoDiv.innerHTML +=
        `
        <div class="chat-text">
        <p>${data.info}</p>
        </div>
        `;
    }
    infoDiv.scrollTop = infoDiv.scrollHeight;
}

function onOpen(socket, username) {
  socket.send(
    JSON.stringify({
      command: "joined",
      info: `${username} just joined`,
      user: username
    })
  );
}

function onLeave(socket, username) {
  socket.send(
    JSON.stringify({
      command: "leave",
      info: `${username} has left`,
      user: username
    })
  );
}

function onJoinedOrLeave(data, username) {
  // console.log(`data from onJoinedOrLeave ${JSON.stringify(data, null, 4)}`)
  if (data.command === "joined" || data.command === "leave") {
    allPlayers = data.players_username_count;
    totalPlayers = data.players_number_count;
    currentPlayer = allPlayers[playerTrack];
    userTurn.textContent = currentPlayer;
    userNum.textContent = data.players_number_count;
    sendChatMessage(data, username)
  }
}
