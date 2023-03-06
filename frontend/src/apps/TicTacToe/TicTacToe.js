import React, { useContext } from 'react';
import './TicTacToe.scss';
import { ENDPOINTS, PATHS, TICTACTOE, WEBSOCKET_MESSAGES, WEBSOCKETS } from 'utils/consts';
import { UsernameContext } from 'providers/UsernameContextProvider';
import GameButton from 'components/atoms/GameButton';
import Chat from 'components/organisms/Chat/Chat';
import { useParams } from 'react-router-dom';
import useWebSocket from 'react-use-websocket';
import { useSocketLeave } from 'hooks/useSocketLeave';
import useUsername from 'hooks/useUsername';
import { useTicTacToeData } from 'hooks/useTicTacToeData';
import {
  getRoomDetailsPlayer,
  putRoomDetails,
  putRoomDetailsPlayer,
  roomDetails
} from 'utils/roomDetails';
import { swalCornerSuccess, swalError, swalSuccess, swalWarning } from 'utils/swal';

const TicTacToe = () => {
  const { isUsernameSet } = useContext(UsernameContext);
  const username = useUsername();
  const { roomName } = useParams();
  const detailsPlayerEndpoint = ENDPOINTS.detailsTicTacToePlayer;
  const detailsRoomEndpoint = ENDPOINTS.detailsTicTacToeRoom;
  const websocket = `${WEBSOCKETS.tictactoe}/${roomName}/`;
  const {
    gameState,
    totalPlayers,
    playersTurn,
    figure,
    boardState,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState
  } = useTicTacToeData(detailsRoomEndpoint, roomName, username);

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: () => {
      if (isUsernameSet) sendJsonMessage(WEBSOCKET_MESSAGES.join(username));
    },
    onMessage: async (message) => {
      const data = JSON.parse(message.data);
      const command = data.command;
      const user = data.user;
      const updatedBoardState = data.value;
      if (command === 'click' && updatedBoardState.every((value) => value !== '')) {
        setBoardState(updatedBoardState);
        setGameState(false);
        swalWarning('Game over!', 'No one won');
      } else if (command === 'click' && user !== username) {
        setBoardState(updatedBoardState);
      } else if (command === 'restart') {
        roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
          setBoardState(data.board_state);
          setGameState(data.game_state);
        });
        swalCornerSuccess('New game', 'The game has restarted');
      } else if (command === 'win') {
        getRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username).then((data) => {
          setGameState(false);
          data.is_winner
            ? swalSuccess('Nice!', 'You won the game')
            : swalError('Sorry', 'You lost');
        });
      }
      roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
        setTotalPlayers(data.total_players);
        setPlayersTurn(data.players_turn);
      });
    }
  });

  const { socketRef } = useSocketLeave(websocket, username, sendJsonMessage);

  const checkWin = async (boardState) => {
    for (let i = 0; i < TICTACTOE.tictactoeWinRows.length; i++) {
      const [a, b, c] = TICTACTOE.tictactoeWinRows[i];
      if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
        await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, { is_winner: true });
        setGameState(false);
        sendJsonMessage(WEBSOCKET_MESSAGES.win(username));
      }
    }
  };

  const handleBoardClick = async (index) => {
    if (!gameState) return swalWarning('Game finished', 'Restart to play again');
    if (totalPlayers !== 2) return swalWarning('Wait', 'Not enough players');
    if (playersTurn !== username) return swalWarning('Wait', "It's not your turn");
    if (boardState[index] !== '') return swalWarning('Oops...', 'Already selected');
    const newBoardState = [...boardState];
    newBoardState[index] = figure;
    setBoardState(newBoardState);
    await putRoomDetails(ENDPOINTS.detailsTicTacToeRoom, roomName, { board_state: newBoardState });
    sendJsonMessage(WEBSOCKET_MESSAGES.click(username, newBoardState));
    await checkWin(newBoardState);
    roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
      setPlayersTurn(data.players_turn);
    });
  };

  const boardElements = boardState.map((value, index) => (
    <div key={index} id={index} className="space" onClick={() => handleBoardClick(index)}>
      {value}
    </div>
  ));

  return (
    <div className="tictactoe-body">
      <GameButton
        className="btn-light"
        value="Menu"
        onClick={() => (window.location.href = PATHS.tictactoe)}
      />
      <GameButton
        className="btn-light"
        value="Restart"
        onClick={() => sendJsonMessage(WEBSOCKET_MESSAGES.restart(username))}
      />
      <div className="tictactoe-wrapper">
        <div className="tictactoe">
          <div className="scoreboard">
            <div>Total players: {totalPlayers}</div>
            <div>{username}</div>
            <div>{playersTurn}&apos;s turn</div>
          </div>
          <div className="board-wrapper">
            <div className="board">{boardElements}</div>
          </div>
        </div>
        <Chat socketRef={socketRef} username={username} />
      </div>
    </div>
  );
};

export default TicTacToe;