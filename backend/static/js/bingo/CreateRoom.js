const create_room = document.querySelector('#create_room');
const new_room = document.querySelector('#new_room');
const room_name = document.querySelector('#room_name');
const join_room = document.querySelector('#join_room');
const username = document.querySelector('#username');
const join_room_btn = document.querySelector('#join_room_btn');

const homeUrl = 'http://localhost:8000/bingo/';
const socket_home_url = 'ws://localhost:8000/ws/online-rooms/bingo/';
const onlinerooms = document.getElementById('onlinerooms');
const socket = new ReconnectingWebSocket(socket_home_url);

username.value = localStorage.getItem('username') || '';

function getInRoom() {
  if (!/^[a-zA-Z0-9-_]+$/.test(room_name.value)) {
    Swal.fire('Error', 'Pleas use underscore and alphanumeric only!', 'error');
  } else {
    if (username.value.length < 3) {
      Swal.fire('Error', 'Username must be larger than 3 letters', 'error');
    } else {
      localStorage.setItem('username', username.value);
      window.location.href = window.location.href + room_name.value;
    }
  }
}

// join_room.addEventListener('click', function () {
//   room_name.classList.remove('d-none');
//   join_room.classList.add('d-none');
//   join_room_btn.classList.remove('d-none');
// });
//
// new_room.addEventListener('click', function () {
//   room_name.classList.remove('d-none');
//   new_room.classList.add('d-none');
//   create_room.classList.remove('d-none');
// });

create_room.addEventListener('click', async function () {
  try {
    const res = await fetch(`${homeUrl}room/check_room/${room_name.value}/`, {
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
  // getInRoom()
});

join_room_btn.addEventListener('click', getInRoom);

socket.onmessage = function (e) {
  const data = JSON.parse(e.data);

  if (data.command === 'online_rooms') {
    onlinerooms.innerHTML = '';
    data.online_rooms.length > 0
      ? data.online_rooms.forEach((el) => {
          onlinerooms.innerHTML += `
       <a id="${el.room_id}" class="room-link" href="/${el.room_name}">
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
        class="animate__animated animate__fadeInLeft room-link" href="/${data.room_name}">
        <div class="room-div">
        <strong>${data.room_name}</strong>
        </div>
        </a>
        `
    );
  }
  if (data.command === 'room_deleted') {
    const del_id = data.room_name + '-' + data.room_id;
    const deleted_room = document.getElementById(del_id);
    onlinerooms.removeChild(deleted_room);
  }
};
