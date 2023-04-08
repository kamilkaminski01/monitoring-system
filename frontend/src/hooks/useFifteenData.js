import { useState } from 'react';
import { generatePuzzleState } from 'utils/boards';
import { useNavigate } from 'react-router-dom';

export const useFifteenData = () => {
  const [puzzleState, setPuzzleState] = useState(generatePuzzleState());
  const [gameState, setGameState] = useState(true);
  const [moves, setMoves] = useState(0);
  const navigate = useNavigate();

  return {
    puzzleState,
    gameState,
    moves,
    setPuzzleState,
    setGameState,
    setMoves,
    navigate
  };
};
