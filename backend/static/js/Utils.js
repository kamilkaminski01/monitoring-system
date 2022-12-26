const menuPageURL = 'http://localhost:3000/';
const tictactoeHomeURL = 'http://localhost:8000/tictactoe/';
const bingoHomeURL = 'http://localhost:8000/bingo/';

function menuPage() {
  window.location.href=menuPageURL;
}

function tictacetoeHomePage() {
  window.location.href=tictactoeHomeURL;
}

function bingoHomePage() {
  window.location.href=bingoHomeURL;
}

function refreshPage() {
  window.location.reload();
}
