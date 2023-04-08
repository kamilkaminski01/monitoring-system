import React, { useContext } from 'react';
import './Fifteen.scss';
import useUsername from 'hooks/useUsername';
import { UsernameContext } from 'providers/UsernameContextProvider';
import { ENDPOINTS, PATHS, WEBSOCKET_MESSAGES, WEBSOCKETS } from 'utils/consts';
import useWebSocket from 'react-use-websocket';
import { useSocketLeave } from 'hooks/useSocketLeave';
import Chat from 'components/organisms/Chat/Chat';
import GameButton from 'components/atoms/GameButton';
import { swalSuccess, swalWarning } from 'utils/swal';
import { putGameDetails } from 'utils/requests';
import { useFifteenData } from 'hooks/useFifteenData';
import { generatePuzzleState } from 'utils/boards';

const Fifteen = () => {
  const { isUsernameSet } = useContext(UsernameContext);
  const username = useUsername();
  const websocket = `${WEBSOCKETS.fifteen}/${username}/`;
  const endpoint = ENDPOINTS.detailsFifteenPuzzle;
  const { puzzleState, gameState, moves, setPuzzleState, setGameState, setMoves, navigate } =
    useFifteenData(endpoint, username);

  const { sendJsonMessage } = useWebSocket(websocket, {
    onOpen: () => {
      if (username) {
        putGameDetails(endpoint, username, {
          board_state: puzzleState
        }).then((response) => {
          if (response.response.status === 404) navigate(PATHS.fifteen);
        });
      } else {
        navigate(PATHS.fifteen);
      }
      if (isUsernameSet) sendJsonMessage(WEBSOCKET_MESSAGES.join(username));
    }
  });

  useSocketLeave(websocket, username, sendJsonMessage);

  const onRestart = async () => {
    const generatedPuzzleState = generatePuzzleState();
    setPuzzleState(generatedPuzzleState);
    setMoves(0);
    setGameState(true);
    await putGameDetails(endpoint, username, {
      board_state: generatedPuzzleState,
      moves: 0,
      game_state: true
    });
    sendJsonMessage(WEBSOCKET_MESSAGES.restart(username));
  };

  const isPuzzleSolved = (puzzleState) => {
    const flattened = puzzleState.flat().filter((value) => value !== null);
    for (let i = 0; i < flattened.length; i++) {
      if (flattened[i] !== i + 1) {
        return false;
      }
    }
    return true;
  };

  const handleTileClick = async (value) => {
    if (!gameState) return swalWarning('Puzzle solved', 'Restart to create a new puzzle');
    const rowIndex = puzzleState.findIndex((row) => row.includes(value));
    const colIndex = puzzleState[rowIndex].indexOf(value);
    const nullRow = puzzleState.findIndex((row) => row.includes(null));
    const nullCol = puzzleState[nullRow].indexOf(null);
    const isAdjacent =
      (rowIndex === nullRow && Math.abs(colIndex - nullCol) === 1) ||
      (colIndex === nullCol && Math.abs(rowIndex - nullRow) === 1);
    if (isAdjacent) {
      const newPuzzleState = puzzleState.map((row) => [...row]);
      const movesValue = moves + 1;
      setMoves(movesValue);
      newPuzzleState[nullRow][nullCol] = value;
      newPuzzleState[rowIndex][colIndex] = null;
      setPuzzleState(newPuzzleState);
      await putGameDetails(ENDPOINTS.detailsFifteenPuzzle, username, {
        board_state: newPuzzleState,
        moves: movesValue
      });
      sendJsonMessage(WEBSOCKET_MESSAGES.click(username, newPuzzleState));
      if (isPuzzleSolved(newPuzzleState)) {
        setGameState(false);
        sendJsonMessage(WEBSOCKET_MESSAGES.win(username));
        await swalSuccess('Nice!', 'You solved the puzzle');
      }
    }
  };

  return (
    <div className="fifteen-body">
      <GameButton
        className="btn-outline-primary"
        value="Home"
        onClick={() => (window.location.href = PATHS.home)}
      />
      <GameButton
        className="btn-outline-primary"
        value="Menu"
        onClick={() => (window.location.href = PATHS.fifteen)}
      />
      <div className="fifteen-wrapper">
        <div className="fifteen">
          <div className="puzzle-container">
            {puzzleState.map((row) =>
              row.map((value) => (
                <div key={value} className="puzzle-block" onClick={() => handleTileClick(value)}>
                  {value}
                </div>
              ))
            )}
          </div>
          <div className="info-container">
            <div className="info d-flex">
              Moves:
              <div key={moves} className="moves">
                {moves}
              </div>
            </div>
            <GameButton
              className="btn-outline-primary"
              value="Restart"
              onClick={() => onRestart()}
            />
          </div>
        </div>
        <Chat websocket={websocket} username={username} />
      </div>
    </div>
  );
};

export default Fifteen;
