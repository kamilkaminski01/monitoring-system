const createRoom = document.querySelector('#create_room');
const joinRoom = document.querySelector('#join_room');
const roomName = document.querySelector('#room_name');
const tictactoeUsername = document.querySelector('#username');

const onlinerooms = document.getElementById('onlinerooms');
const tictactoeHomeUrl = 'http://localhost:8000/tictactoe/';
const tictactoeOnlineRoomsSocketUrl = 'ws://localhost:8000/ws/online-rooms/tictactoe/';
const tictactoeOnlineRoomsSocket = new WebSocket(tictactoeOnlineRoomsSocketUrl);

tictactoeUsername.value = localStorage.getItem('username') || '';

function getInRoom() {
  if (!/^[a-zA-Z0-9-_]+$/.test(roomName.value)) {
    swal('Error', 'Please use underscore and alphanumeric only!', 'error');
  } else {
    if (tictactoeUsername.value.length < 3) {
      swal('Error', 'Username must be larger than 3 letters', 'error');
    } else {
      localStorage.setItem('username', tictactoeUsername.value);
      window.location.href = window.location.href + roomName.value;
    }
  }
}

createRoom.addEventListener('click', async function () {
  try {
    const res = await fetch(`${tictactoeHomeUrl}room/check_room/${roomName.value}/`, {
      method: 'GET'
    });
    const r = await res.json();
    if (r.room_exist) {
      swal('Room Name Taken', 'Please choose other or join this room!', 'error');
    } else {
      getInRoom();
    }
  } catch (error) {
    console.log(error);
  }
});

joinRoom.addEventListener('click', getInRoom);

tictactoeOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);

  if (data.command === 'online_rooms') {
    onlinerooms.innerHTML = '';
    data.online_rooms.length > 0
      ? data.online_rooms.forEach((el) => {
          onlinerooms.innerHTML += `
       <a id="${el.room_id}" class="room-link" href="/tictactoe/${el.room_name}">
       <div class="room-div text-white">
       <strong>${el.room_name}</strong>
       </div>
       </a>
        `;
        })
      : (onlinerooms.innerHTML = '<p id="no_room" class="room-div text-white">No Online Rooms Currently</p>');
  }
  if (data.command === 'room_added') {
    const no_room = document.getElementById('no_room');
    if (no_room) {
      onlinerooms.removeChild(no_room);
    }
    onlinerooms.insertAdjacentHTML(
      'afterbegin',
      `
        <a id="${data.room_name}-${data.room_id}"
        class="animate__animated animate__fadeInLeft room-link" href="/tictactoe/${data.room_name}">
        <div class="room-div text-white">
        <strong>${data.room_name}</strong>
        </div>
        </a>
        `
    );
  }
  if (data.command === 'room_deleted') {
    const deletedRoomId = data.room_name + '-' + data.room_id;
    const deletedRoom = document.getElementById(deletedRoomId);
    onlinerooms.removeChild(deletedRoom);
  }
};
