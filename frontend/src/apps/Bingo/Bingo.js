import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import './Bingo.scss';
import useUsername from 'hooks/useUsername';
import { UsernameContext } from 'providers/UsernameContextProvider';
import Chat from 'components/organisms/Chat/Chat';
import GameButton from 'components/atoms/GameButton';
import { BINGO, ENDPOINTS, PATHS, WEBSOCKET_MESSAGES, WEBSOCKETS } from 'utils/consts';
import { generateBoardState } from 'utils/generateBoardState';
import useWebSocket from 'react-use-websocket';
import { swalCornerSuccess, swalError, swalSuccess, swalWarning } from 'utils/swal';
import {
  getRoomDetailsPlayer,
  putRoomDetailsPlayer,
  roomDetails,
  putRoomDetails
} from 'utils/roomDetails';
import { useBingoData } from 'hooks/useBingoData';
import { useSocketLeave } from 'hooks/useSocketLeave';

const Bingo = () => {
  const { isUsernameSet } = useContext(UsernameContext);
  const username = useUsername();
  const { roomName } = useParams();
  const detailsPlayerEndpoint = ENDPOINTS.detailsBingoPlayer;
  const detailsRoomEndpoint = ENDPOINTS.detailsBingoRoom;
  const websocket = `${WEBSOCKETS.bingo}/${roomName}/`;
  const {
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
    getBoardStateIndexes,
    setInitialBoardState
  } = useBingoData(detailsRoomEndpoint, roomName);

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: async () => {
      roomDetails(detailsRoomEndpoint, roomName, true).then(async (data) => {
        const isNewPlayer = !data.players.some((player) => player.username === username);
        const currentPlayer = data.players.find((player) => player.username === username);
        if (isNewPlayer || currentPlayer.initial_board_state.length === 0) {
          await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, {
            initial_board_state: initialBoardState
          });
        } else {
          setInitialBoardState(currentPlayer.initial_board_state);
          generateGrid();
          await checkBingo(
            getBoardStateIndexes(data.board_state, currentPlayer.initial_board_state),
            data.game_state
          );
        }
      });
      if (isUsernameSet) sendJsonMessage(WEBSOCKET_MESSAGES.join(username));
    },
    onMessage: async (message) => {
      const data = JSON.parse(message.data);
      const command = data.command;
      const user = data.user;
      const value = data.value;
      const index = initialBoardState.indexOf(value);
      if (command === 'click' && user !== username) {
        const updatedBoardState = [...boardState, value];
        const updatedBoardStateIndexes = [...boardStateIndexes, index];
        setBoardState(updatedBoardState);
        setBoardStateIndexes(updatedBoardStateIndexes);
        await checkBingo(updatedBoardStateIndexes, gameState);
      } else if (command === 'restart') {
        const generatedBoardState = generateBoardState();
        setInitialBoardState(generatedBoardState);
        setBoardStateIndexes([]);
        setBingoState([]);
        roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
          setBoardState(data.board_state);
          setGameState(data.game_state);
        });
        await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, {
          initial_board_state: generatedBoardState
        });
        generateGrid();
        swalCornerSuccess('New game', 'The game has restarted');
      } else if (command === 'win') {
        setGameState(false);
        getRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username).then((data) => {
          data.is_winner
            ? swalSuccess('BINGO!', 'You won the game')
            : swalError('Sorry', 'You lost');
        });
      }
      setTimeout(() => {
        roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
          setTotalPlayers(data.total_players);
          setPlayersTurn(data.players_turn);
        });
      }, 50);
    }
  });

  useSocketLeave(websocket, username, sendJsonMessage);

  const checkBingo = async (boardStateIndexes, gameState) => {
    const bingoState = [];
    const playerData = { username };
    for (let i = 0; i < BINGO.bingoWinRows.length && bingoState.length < 5; i++) {
      const row = BINGO.bingoWinRows[i];
      const isBingo = row.every((index) => boardStateIndexes.includes(index));
      if (isBingo) {
        bingoState.push(BINGO.bingoWinState[bingoState.length]);
        row.forEach((value, index) => {
          setTimeout(() => {
            const item = document.getElementById(value);
            item.classList.remove('clicked');
            item.classList.add('success-row');
          }, index * 80);
        });
      }
    }
    playerData.is_winner = bingoState.length >= 5;
    playerData.bingo_state = bingoState;
    setBingoState(bingoState);
    await putRoomDetailsPlayer(detailsPlayerEndpoint, roomName, username, playerData);
    if (playerData.is_winner && gameState) sendJsonMessage(WEBSOCKET_MESSAGES.win(username));
  };

  const handleGridClick = async (key, index) => {
    if (!gameState) return swalWarning('Game finished', 'Restart to play again');
    if (totalPlayers !== playersLimit) return swalWarning('Wait', 'Not enough players');
    if (playersTurn !== username) return swalWarning('Wait', "It's not your turn");
    if (boardState.includes(key)) return swalWarning('Oops...', 'Already selected');
    sendJsonMessage(WEBSOCKET_MESSAGES.click(username, key));
    const updatedBoardState = [...boardState, key];
    const updatedBoardStateIndexes = [...boardStateIndexes, index];
    setBoardState(updatedBoardState);
    setBoardStateIndexes(updatedBoardStateIndexes);
    await putRoomDetails(detailsRoomEndpoint, roomName, { board_state: updatedBoardState });
    await checkBingo(updatedBoardStateIndexes, gameState);
    roomDetails(detailsRoomEndpoint, roomName, true).then((data) => {
      setPlayersTurn(data.players_turn);
    });
  };

  const generateGrid = () => {
    return (
      <div className="grid">
        {initialBoardState.map((key, index) => (
          <span
            key={key}
            id={index}
            onClick={() => handleGridClick(key, index)}
            className={boardState.includes(key) ? 'clicked' : ''}>
            {key}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="bingo-body">
      <GameButton
        className="btn-danger"
        value="Home"
        onClick={() => (window.location.href = PATHS.home)}
      />
      <GameButton
        className="btn-danger"
        value="Menu"
        onClick={() => (window.location.href = PATHS.bingo)}
      />
      <GameButton
        className="btn-danger"
        value="Restart"
        onClick={() => sendJsonMessage(WEBSOCKET_MESSAGES.restart(username))}
      />
      <div className="bingo-wrapper">
        <div className="bingo">
          <div className="scoreboard">
            <div className="username">{username}</div>
            <div className="d-flex">
              Total players:
              <div key={totalPlayers} className="total-players">
                {totalPlayers}
              </div>
            </div>
            <div className="room-info">
              <div>Players limit: {playersLimit}</div>
              <div key={playersTurn} className="players-turn">
                {playersTurn}&apos;s turn
              </div>
            </div>
          </div>
          <div>{generateGrid()}</div>
          <div key={bingoState} className="bingo-state">
            {bingoState}
          </div>
        </div>
        <Chat websocket={websocket} username={username} />
      </div>
    </div>
  );
};

export default Bingo;
