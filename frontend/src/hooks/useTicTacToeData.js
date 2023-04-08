import { useEffect, useState } from 'react';
import { roomDetails } from 'utils/requests';
import { useNavigate } from 'react-router-dom';
import { PATHS } from 'utils/consts';

export const useTicTacToeData = (endpoint, roomName, username) => {
  const [players, setPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [playersTurn, setPlayersTurn] = useState('');
  const [boardState, setBoardState] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [readyState, setReadyState] = useState(false);
  const [figure, setFigure] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    roomDetails(endpoint, roomName, true)
      .then((data) => {
        const player = data.players.find((p) => p.username === username);
        setPlayers(data.players);
        setGameState(data.game_state);
        setTotalPlayers(data.total_players);
        setPlayersTurn(data.players_turn);
        setBoardState(data.board_state);
        setReadyState(player.is_ready);
        setFigure(player.figure);
      })
      .catch(() => {
        navigate(PATHS.tictactoe);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endpoint, roomName, username]);

  return {
    gameState,
    readyState,
    totalPlayers,
    players,
    playersTurn,
    figure,
    boardState,
    setGameState,
    setReadyState,
    setPlayers,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState,
    navigate
  };
};
