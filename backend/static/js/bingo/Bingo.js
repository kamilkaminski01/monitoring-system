const grid = document.querySelector(".grid");
const items = [...document.querySelector(".grid").children];
const bingodiv = document.querySelector("#bingodiv");

const bingoState = ["B", "I", "N", "G", "O", ""];
let bingoIndex = 0;
let keysArr = [];

window.onload = () => {
  getRandomArray();
  fillGrid();
};

// All possible combinations for bingo win
const bingoWinRows = [
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
    let b = Math.ceil(Math.random() * 25);
    if (!keysArr.includes(b)) {
      keysArr.push(b);
    } else {
      i--;
    }
  }
}

function checkBingo(item) {
  const dataID = item.dataset.id;
  const innernum = item.dataset.innernum
  const dataNumber = parseInt(dataID);
  if (datasetArr.includes(dataNumber))
    return Swal.fire("Oops..", "Already selected", "error");
  datasetArr.push(dataNumber);
  item.classList.add("clicked");
  bingoSocket.send(
    JSON.stringify({
      command: "clicked",
      user: bingoUsername,
      dataID: dataID,
      dataset: innernum,
    })
  );
  loopItemsAndCheck();
}

function fillGrid() {
  items.forEach((item, index) => {
    item.innerHTML = keysArr[index];
    item.dataset.innernum = keysArr[index];
    item.addEventListener("click", (e) => {
      if (gamestate !== "ON")
        return Swal.fire("Game finished", "Restart to play again!", "error");
      if (currentPlayer !== bingoUsername)
        return Swal.fire("Oops..", "Not your turn!", "error");
      if (totalPlayers !== playersLimitNumber)
        return Swal.fire("Oops...", "Wait for the rest of the players", "error");
      checkBingo(item);
    });
  });
}

const includesAll = (arr, values) => values.every((v) => arr.includes(v));

function successGrid(index, li) {
  setTimeout(() => {
    const doneBingoDiv = document.querySelector(`[data-id='${li}']`);
    doneBingoDiv.classList.remove("clicked");
    doneBingoDiv.classList.add("bingoSuccess");
  }, index * 80);
}

function loopItemsAndCheck() {
  for (const j of bingoWinRows) {
    if (includesAll(datasetArr, j)) {
      for (let [index, li] of j.entries())
        successGrid(index, li);
      const index = bingoWinRows.indexOf(j);
      if (index > -1)
        bingoWinRows.splice(index, 1);
      let span = document.createElement("span");
      span.classList.add("bingState");
      span.append(bingoState[bingoIndex]);
      bingodiv.append(span);
      bingoIndex += 1;
      if (bingoIndex === 5) {
        bingoSocket.send(
          JSON.stringify({
            command: "win",
            user: bingoUsername,
            info: `${bingoUsername} won the game`,
          })
        );
      }
    }
  }
}
