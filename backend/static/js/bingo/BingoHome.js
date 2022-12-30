const createRoom = document.querySelector('#createRoom');
const joinRoom = document.querySelector('#joinRoom');
const roomName = document.querySelector('#roomName');
const bingoUsername = document.querySelector('#username');

const onlinerooms = document.getElementById('onlinerooms');
const bingoHomeUrl = 'http://localhost:8000/bingo/';
const bingoOnlineRoomsUrl = 'ws://localhost:8000/ws/online-rooms/bingo/';
const bingoOnlineRoomsSocket = new WebSocket(bingoOnlineRoomsUrl);

bingoUsername.value = localStorage.getItem('username') || '';

function getInRoom() {
  if (!/^[a-zA-Z0-9-_]+$/.test(roomName.value)) {
    Swal.fire('Error', 'Please use underscore and alphanumeric only!', 'error');
  } else {
    if (bingoUsername.value.length < 3) {
      Swal.fire('Error', 'Username must be larger than 3 letters', 'error');
    } else {
      localStorage.setItem('username', bingoUsername.value);
      window.location.href = window.location.href + roomName.value;
    }
  }
}

createRoom.addEventListener('click', async function () {
  try {
    const res = await fetch(`${bingoHomeUrl}room/check_room/${roomName.value}/`, {
      method: 'GET'
    });
    const r = await res.json();
    if (r.room_exist) {
      Swal.fire('Room Name Taken', 'Please choose other or join this room!', 'error');
    } else {
      getInRoom();
    }
  } catch (error) {
    console.log(error);
  }
});

joinRoom.addEventListener('click', getInRoom);

bingoOnlineRoomsSocket.onmessage = function (e) {
  const data = JSON.parse(e.data);

  if (data.command === 'online_rooms') {
    onlinerooms.innerHTML = '';
    data.online_rooms.length > 0
      ? data.online_rooms.forEach((el) => {
          onlinerooms.innerHTML += `
       <a id="${el.room_id}" class="room-link" href="/bingo/${el.room_name}">
       <div class="room-div">
       <strong>${el.room_name}</strong>
       </div>
       </a>
        `;
        })
      : (onlinerooms.innerHTML = '<p id="no_room" class="room-div">No Online Rooms Currently</p>');
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
        class="animate__animated animate__fadeInLeft room-link" href="/bingo/${data.room_name}">
        <div class="room-div">
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
