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
  if (data.command === "joined" || data.command === "leave") {
    playersNumber.textContent = data.players_number_count;
    totalPlayers = data.players_number_count;
    sendChatMessage(data, username);
  }
}
