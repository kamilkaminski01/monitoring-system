export const generateBoardState = () => {
  const boardState = [];
  for (let i = 1; i < 26; i++) {
    const b = Math.ceil(Math.random() * 25);
    if (!boardState.includes(b)) {
      boardState.push(b);
    } else {
      i--;
    }
  }
  return boardState;
};

export const getBoardStateIndexes = (boardState, initialBoardState) => {
  return boardState.map((value) => initialBoardState.indexOf(value));
};
