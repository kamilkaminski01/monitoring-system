import { useEffect, useState } from 'react';
import { roomDetails } from 'utils/roomDetails';
import { generateBoardState } from 'utils/bingoBoardUtils';

export const useBingoData = (endpoint, roomName) => {
  const [playersLimit, setPlayersLimit] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [playersTurn, setPlayersTurn] = useState('');
  const [boardState, setBoardState] = useState([]);
  const [boardStateIndexes, setBoardStateIndexes] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [bingoState, setBingoState] = useState([]);
  const [initialBoardState, setInitialBoardState] = useState(generateBoardState());

  useEffect(() => {
    roomDetails(endpoint, roomName, true).then((data) => {
      setGameState(data.game_state);
      setPlayersLimit(data.players_limit);
      setTotalPlayers(data.total_players);
      setPlayersTurn(data.players_turn);
      setBoardState(data.board_state);
    });
  }, [endpoint, roomName]);

  return {
    gameState,
    totalPlayers,
    playersLimit,
    playersTurn,
    bingoState,
    boardState,
    boardStateIndexes,
    initialBoardState,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState,
    setBingoState,
    setBoardStateIndexes,
    setInitialBoardState
  };
};
