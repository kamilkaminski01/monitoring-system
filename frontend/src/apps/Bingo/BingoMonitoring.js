import React from 'react';
import './Bingo.scss';
import './BingoMonitoring.scss';
import { useParams } from 'react-router-dom';
import useUsername from 'hooks/useUsername';
import { BINGO, ENDPOINTS, LOCAL_STORAGE, WEBSOCKETS } from 'utils/consts';
import useWebSocket from 'react-use-websocket';
import { getAuthRoomDetails } from 'utils/requests';
import { useBingoMonitoringData } from 'hooks/useBingoMonitoringData';
import { getBoardStateIndexes } from 'utils/boards';
import MonitoringRoomInfo from 'components/atoms/MonitoringRoomInfo/MonitoringRoomInfo';
import MonitoringPlayerInfo from 'components/atoms/MonitoringPlayerInfo/MonitoringPlayerInfo';
import MonitoringChat from 'components/atoms/MonitoringChat/MonitoringChat';

const BingoMonitoring = () => {
  const { roomName } = useParams();
  const username = useUsername();
  const detailsRoomEndpoint = ENDPOINTS.monitoringBingoRoom;
  const websocket = `${WEBSOCKETS.bingo}/${roomName}/?token=${localStorage.getItem(
    LOCAL_STORAGE.accessToken
  )}`;
  const {
    roomPlayers,
    gameState,
    totalPlayers,
    playersTurn,
    boardState,
    playersLimit,
    setRoomPlayers,
    setGameState,
    setTotalPlayers,
    setPlayersTurn,
    setBoardState
  } = useBingoMonitoringData(detailsRoomEndpoint, roomName);

  useWebSocket(websocket, {
    onOpen: () => {
      roomPlayers.forEach((player) => {
        checkBingo(boardState, player);
      });
    },
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      const command = data.command;
      setTimeout(() => {
        getAuthRoomDetails(detailsRoomEndpoint, roomName)
          .then((data) => {
            const playersData = data.players.map((player) => {
              return {
                username: player.username,
                isActive: player.is_active,
                isWinner: player.is_winner,
                bingoState: player.bingo_state,
                initialBoardState: player.initial_board_state
              };
            });
            setBoardState(data.board_state);
            setRoomPlayers(playersData);
            setTotalPlayers(data.total_players);
            setPlayersTurn(data.players_turn);
            setGameState(data.game_state);
          })
          .catch(() => {
            window.close();
          });
      }, 100);
      if (command === 'click') {
        const updatedBoardState = [...boardState, data.value];
        setBoardState(updatedBoardState);
        roomPlayers.forEach((player) => {
          checkBingo(updatedBoardState, player);
        });
      }
    }
  });

  const checkBingo = (boardState, player) => {
    const boardStateIndexes = getBoardStateIndexes(boardState, player.initialBoardState);
    const bingoState = [];
    for (let i = 0; i < BINGO.winRows.length && bingoState.length < 5; i++) {
      const row = BINGO.winRows[i];
      const isBingo = row.every((index) => boardStateIndexes.includes(index));
      if (isBingo) {
        bingoState.push(BINGO.winState[bingoState.length]);
        player.bingoState = bingoState;
        row.forEach((value, index) => {
          setTimeout(() => {
            const item = document.getElementById(`${player.username}-${value}`);
            item.classList.remove('clicked');
            item.classList.add('success-row');
          }, index * 80);
        });
      }
    }
  };

  function generateGrid(player) {
    return (
      <div key={player.username} className="grid">
        {player.initialBoardState.map((key, index) => (
          <span
            key={key}
            id={`${player.username}-${index}`}
            className={boardState.includes(key) ? 'clicked' : ''}>
            {key}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div className="bingo-body bingo-monitoring">
      <MonitoringRoomInfo
        roomName={roomName}
        gameState={gameState}
        totalPlayers={totalPlayers}
        playersTurn={playersTurn}
        playersLimit={playersLimit}
      />
      <div className="bingo-wrapper">
        <div className="bingo">
          {roomPlayers.map((player) => (
            <div key={player.username}>
              <MonitoringPlayerInfo player={player} />
              {generateGrid(player)}
              <div key={player.bingoState} className="bingo-state">
                {player.bingoState}
              </div>
            </div>
          ))}
        </div>
        <MonitoringChat websocket={websocket} username={username} />
      </div>
    </div>
  );
};

export default BingoMonitoring;
