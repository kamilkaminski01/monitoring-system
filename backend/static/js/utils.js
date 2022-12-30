const menuPageURL = 'http://localhost:3000/';
const tictactoeHomeURL = 'http://localhost:8000/tictactoe/';
const bingoHomeURL = 'http://localhost:8000/bingo/';

function menuPage() {
  window.location.href=menuPageURL;
}

function tictactoeHomePage() {
  window.location.href=tictactoeHomeURL;
}

function bingoHomePage() {
  window.location.href=bingoHomeURL;
}

function refreshPage() {
  window.location.reload();
}

function setUsername(username) {
  if (!username) {
    const name = prompt('Please give a username:');
    localStorage.setItem('username', name);
  }

  const userdiv = document.getElementById('userdiv');
  userdiv.textContent = username;
}
