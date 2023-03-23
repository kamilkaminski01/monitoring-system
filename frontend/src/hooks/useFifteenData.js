import { useState } from 'react';
import { generatePuzzleState } from 'utils/boards';

export const useFifteenData = () => {
  const [puzzleState, setPuzzleState] = useState(generatePuzzleState());
  const [gameState, setGameState] = useState(true);
  const [moves, setMoves] = useState(0);

  return {
    puzzleState,
    gameState,
    moves,
    setPuzzleState,
    setGameState,
    setMoves
  };
};
