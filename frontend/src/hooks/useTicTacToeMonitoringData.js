import { useEffect, useState } from 'react';
import { getAuthRoomDetails } from 'utils/roomDetails';

export const useTicTacToeMonitoringData = (endpoint, roomName, username) => {
  const [roomPlayers, setRoomPlayers] = useState([]);
  const [totalPlayers, setTotalPlayers] = useState(0);
  const [boardState, setBoardState] = useState([]);
  const [gameState, setGameState] = useState(false);
  const [playersTurn, setPlayersTurn] = useState('');

  useEffect(() => {
    getAuthRoomDetails(endpoint, roomName).then((data) => {
      setGameState(data.game_state);
      setTotalPlayers(data.total_players);
      setPlayersTurn(data.players_turn);
      setBoardState(data.board_state);
      const newPlayers = data.players.map((player) => {
        return {
          username: player.username,
          isActive: player.is_active,
          isWinner: player.is_winner,
          figure: player.figure
        };
      });
      setRoomPlayers(newPlayers);
    });
  }, [endpoint, roomName, username]);

  return {
    roomPlayers,
    gameState,
    totalPlayers,
    playersTurn,
    boardState,
    setRoomPlayers,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState
  };
};
