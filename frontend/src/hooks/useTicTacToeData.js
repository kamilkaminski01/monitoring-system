import { useEffect, useState } from 'react';
import { getRoomDetailsPlayer, roomDetails } from 'utils/roomDetails';
import { ENDPOINTS } from 'utils/consts';

export const useTicTacToeData = (endpoint, roomName, username) => {
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [playersTurn, setPlayersTurn] = useState('');
  const [boardState, setBoardState] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [figure, setFigure] = useState('');

  useEffect(() => {
    roomDetails(endpoint, roomName, true).then((data) => {
      setGameState(data.game_state);
      setTotalPlayers(data.total_players);
      setPlayersTurn(data.players_turn);
      setBoardState(data.board_state);
    });
    getRoomDetailsPlayer(ENDPOINTS.detailsTicTacToePlayer, roomName, username)
      .then((data) => {
        setFigure(data.figure);
      })
      // eslint-disable-next-line n/handle-callback-err
      .catch((error) => {
        setFigure('X');
      });
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
    setBoardState
  };
};
