const grid = document.querySelector('.grid');
const items = [...document.querySelector('.grid').children];
const bingodiv = document.querySelector('#bingodiv');

const bingoState = ['B', 'I', 'N', 'G', 'O'];
let bingoIndex = 0;
let keysArr = [];

window.onload = () => {
  restart();
};

// All possible combinations for bingo win
const bingoItems = [
  [1, 2, 3, 4, 5],
  [6, 7, 8, 9, 10],
  [11, 12, 13, 14, 15],
  [16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25],
  [1, 7, 13, 19, 25],
  [1, 6, 11, 16, 21],
  [2, 7, 12, 17, 22],
  [3, 8, 13, 18, 23],
  [4, 9, 14, 19, 24],
  [5, 10, 15, 20, 25],
  [5, 9, 13, 17, 21]
];

function getRandomArray() {
  keysArr = [];
  for (let i = 1; i < 26; i++) {
    b = Math.ceil(Math.random() * 25);
    if (!keysArr.includes(b)) {
      keysArr.push(b);
    } else {
      i--;
    }
  }
}

const includesAll = (arr, values) => values.every((v) => arr.includes(v));

function fillGrid() {
  items.forEach((item, ind) => {
    item.innerHTML = keysArr[ind];
    item.dataset.innernum = keysArr[ind];

    item.addEventListener('click', (e) => {
      if (gamestate !== 'ON') {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Game finished! Please restart to play again!'
        });
      }
      if (currentPlayer !== bingoUsername) {
        return Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: 'Not your turn!',
          toast: true,
          position: 'top-right'
        });
      }
      checkBingo(item);
    });
  });
}

function restart() {
  getRandomArray();
  fillGrid();
}

function checkBingo(item) {
  const dataid = item.dataset.id;
  const innernum = item.dataset.innernum;
  const dataint = parseInt(dataid);
  if (addmearr.includes(dataint)) {
    return Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: 'Already selected',
      toast: true,
      position: 'top-right'
    });
  }
  addmearr.push(dataint);
  item.classList.add('clicked');
  bingoSocket.send(
    JSON.stringify({
      command: 'clicked',
      dataset: innernum,
      dataid: dataid,
      user: bingoUsername
    })
  );
  loopItemsAndCheck();
}

function loopItemsAndCheck() {
  for (const j of bingoItems) {
    if (includesAll(addmearr, j)) {
      for (let [ind, li] of j.entries()) {
        successGrid(ind, li);
      }

      const index = bingoItems.indexOf(j);
      if (index > -1) {
        bingoItems.splice(index, 1);
      }
      let span = document.createElement('span');
      span.classList.add('bingState');
      span.append(bingoState[bingoIndex]);
      bingodiv.append(span);
      bingoIndex += 1;
      if (bingoIndex === 5) {
        Swal.fire(bingoUsername, 'You won the game', 'success');
        bingoSocket.send(
          JSON.stringify({
            command: 'won',
            user: bingoUsername,
            bingoCount: bingoIndex,
            info: `${bingoUsername} won the game`
          })
        );
      }
    }
  }
}

function successGrid(ind, li) {
  setTimeout(() => {
    const doneBingoDiv = document.querySelector(`[data-id='${li}']`);
    doneBingoDiv.classList.remove('clicked');
    doneBingoDiv.classList.add('bingoSuccess');
  }, ind * 50);
}
