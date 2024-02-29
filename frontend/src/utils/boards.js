import { BINGO } from 'utils/consts'

export const generateBoardState = () => {
  const boardState = []
  for (let i = 1; i < 26; i++) {
    const b = Math.ceil(Math.random() * 25)
    if (!boardState.includes(b)) {
      boardState.push(b)
    } else {
      i--
    }
  }
  return boardState
}

export const getBoardStateIndexes = (boardState, initialBoardState) => {
  return boardState.map((value) => initialBoardState.indexOf(value))
}

export const highlightBingo = (boardStateIndexes, username) => {
  for (let i = 0; i < BINGO.winRows.length; i++) {
    const row = BINGO.winRows[i]
    const isBingo = row.every((index) => boardStateIndexes.includes(index))
    if (isBingo) {
      row.forEach((value, index) => {
        setTimeout(() => {
          const item = document.getElementById(`${username}-${value}`)
          if (item) {
            item.classList.remove('clicked')
            item.classList.add('game-grid--success')
          }
        }, index * 80)
      })
    }
  }
}

export const generatePuzzleState = () => {
  const values = Array.from({ length: 15 }, (_, i) => i + 1)
  let inversions, blankRow
  const countInversions = (arr) => {
    let count = 0
    for (let i = 0; i < arr.length - 1; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        if (arr[i] > arr[j]) {
          count++
        }
      }
    }
    return count
  }
  do {
    for (let i = values.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1))
      ;[values[i], values[j]] = [values[j], values[i]]
    }
    inversions = countInversions(values)
    blankRow = Math.floor(values.indexOf(null) / 4)
  } while (inversions % 2 !== (3 - blankRow) % 2)
  values.push(null)
  const puzzleState = []
  for (let i = 0; i < 4; i++) {
    puzzleState.push(values.slice(i * 4, i * 4 + 4))
  }
  return puzzleState
}
