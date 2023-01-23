function checkOnlineRooms(data, app) {
  if (data.command === 'online_rooms') {
    onlinerooms.innerHTML = '';
    if (data.online_rooms.length > 0) {
      data.online_rooms.forEach((el) => {
        onlinerooms.innerHTML += `
          <a id="${el.room_id}" class="room-link" href="/${app}/${el.room_name}">
          <div class="room-div text-white">
          <strong>${el.room_name}</strong>
          </div>
          </a>
      `;
      });
    } else if (onlinerooms.childElementCount === 0) {
      onlinerooms.innerHTML =
        '<p id="no_room" class="room-div text-white">No Online Rooms Currently</p>';
    }
  }
}

function roomAdded(data, app) {
  if (data.command === 'room_added') {
    const no_room = document.getElementById('no_room');
    if (no_room) {
      onlinerooms.removeChild(no_room);
    }
    onlinerooms.insertAdjacentHTML(
      'afterbegin',
      `
        <a id="${data.room_name}-${data.room_id}"
        class="animate__animated animate__fadeInLeft room-link" href="/${app}/${data.room_name}">
        <div class="room-div">
        <strong>${data.room_name}</strong>
        </div>
        </a>
        `
    );
  }
}

function roomDeleted(data) {
  if (data.command === 'room_deleted') {
    const deletedRoomId = data.room_name + '-' + data.room_id;
    const deletedRoom = document.getElementById(deletedRoomId);
    onlinerooms.removeChild(deletedRoom);
    if (onlinerooms.childElementCount === 0) {
      onlinerooms.innerHTML =
        '<p id="no_room" class="room-div text-white">No Online Rooms Currently</p>';
    }
  }
}
