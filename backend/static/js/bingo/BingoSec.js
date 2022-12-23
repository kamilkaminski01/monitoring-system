const username = localStorage.getItem('username');

if (!username) {
  const name = prompt('Please give a username:');
  localStorage.setItem('username', name);
}

const userdiv = document.getElementById('userdiv');
userdiv.textContent = username;
