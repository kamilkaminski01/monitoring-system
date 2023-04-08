import { useEffect, useState } from 'react';
import { roomDetails } from 'utils/requests';
import { generateBoardState } from 'utils/boards';
import { PATHS } from 'utils/consts';
import { useNavigate } from 'react-router-dom';

export const useBingoData = (endpoint, roomName, username) => {
  const [players, setPlayers] = useState([]);
  const [playersLimit, setPlayersLimit] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [playersTurn, setPlayersTurn] = useState('');
  const [boardState, setBoardState] = useState([]);
  const [boardStateIndexes, setBoardStateIndexes] = useState([]);
  const [readyState, setReadyState] = useState(false);
  const [gameState, setGameState] = useState(false);
  const [bingoState, setBingoState] = useState([]);
  const [initialBoardState, setInitialBoardState] = useState(generateBoardState());
  const navigate = useNavigate();

  useEffect(() => {
    roomDetails(endpoint, roomName, true)
      .then((data) => {
        const player = data.players.find((p) => p.username === username);
        setPlayers(data.players);
        setGameState(data.game_state);
        setPlayersLimit(data.players_limit);
        setTotalPlayers(data.total_players);
        setPlayersTurn(data.players_turn);
        setBoardState(data.board_state);
        setReadyState(player.is_ready);
      })
      .catch(() => {
        navigate(PATHS.bingo);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, roomName, username]);

  return {
    gameState,
    players,
    readyState,
    totalPlayers,
    playersLimit,
    playersTurn,
    bingoState,
    boardState,
    boardStateIndexes,
    initialBoardState,
    setPlayers,
    setReadyState,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState,
    setBingoState,
    setBoardStateIndexes,
    setInitialBoardState,
    navigate
  };
};
