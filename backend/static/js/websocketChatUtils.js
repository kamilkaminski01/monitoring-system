function chatContent(e, socket, username) {
  if (e.key === "Enter") {
    if (!chatInput.value.trim()) {
      return Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Your message cant be empty!",
        toast: true,
        position: "top-right"
      });
    }
    socket.send(
      JSON.stringify({
        user: username,
        chat: chatInput.value,
        command: "chat"
      })
    );
    chatInput.value = "";
  }
}

function chatData(data) {
  if (data.command === "chat") {
    infoDiv.innerHTML += `
      <div class="side-text">
        <p>${data.chat}<span class="float-right"> - ${data.user}</span></p>
      </div>
    `;
    infoDiv.scrollTop = infoDiv.scrollHeight;
  }
}
