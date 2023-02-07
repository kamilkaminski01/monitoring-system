function notForMeData(data, username) {
  return data.user !== username;
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
    // This if statement is for bingo game
    if (data.command === "joined" && data.players_limit) {
      playersLimit.textContent = data.players_limit;
      playersLimitNumber = data.players_limit;
    }
    sendChatMessage(data, username);
  }
}
