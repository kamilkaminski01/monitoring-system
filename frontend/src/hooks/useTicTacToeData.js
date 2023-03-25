import { useEffect, useState } from 'react';
import { roomDetails } from 'utils/requests';
import { useNavigate } from 'react-router-dom';

export const useTicTacToeData = (endpoint, roomName, username) => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [playersTurn, setPlayersTurn] = useState('');
  const [boardState, setBoardState] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [figure, setFigure] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      roomDetails(endpoint, roomName, true).then((data) => {
        const player = data.players.find((p) => p.username === username);
        setGameState(data.game_state);
        setTotalPlayers(data.total_players);
        setPlayersTurn(data.players_turn);
        setBoardState(data.board_state);
        setFigure(player.figure);
      });
    }, 50);
  }, [endpoint, roomName, username]);

  return {
    gameState,
    totalPlayers,
    playersTurn,
    figure,
    boardState,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState,
    navigate
  };
};
