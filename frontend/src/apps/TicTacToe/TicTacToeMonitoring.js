import React from 'react';
import './TicTacToe.scss';
import './TicTacToeMonitoring.scss';
import { ENDPOINTS, LOCAL_STORAGE, WEBSOCKETS } from 'utils/consts';
import { useParams } from 'react-router-dom';
import { useTicTacToeMonitoringData } from 'hooks/useTicTacToeMonitoringData';
import useUsername from 'hooks/useUsername';
import useWebSocket from 'react-use-websocket';
import { getAuthRoomDetails } from 'utils/requests';
import MonitoringGameInfo from 'components/atoms/MonitoringRoomInfo/MonitoringGameInfo';
import MonitoringPlayerInfo from 'components/atoms/MonitoringPlayerInfo/MonitoringPlayerInfo';
import MonitoringChat from 'components/atoms/MonitoringChat/MonitoringChat';

const TicTacToeMonitoring = () => {
  const { roomName } = useParams();
  const username = useUsername();
  const detailsRoomEndpoint = ENDPOINTS.monitoringTicTacToeRoom;
  const websocket = `${WEBSOCKETS.tictactoe}/${roomName}/?token=${localStorage.getItem(
    LOCAL_STORAGE.accessToken
  )}`;
  const {
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
  } = useTicTacToeMonitoringData(detailsRoomEndpoint, roomName);

  useWebSocket(websocket, {
    onOpen: () => {},
    onMessage: (message) => {
      const data = JSON.parse(message.data);
      setTimeout(() => {
        getAuthRoomDetails(detailsRoomEndpoint, roomName)
          .then((data) => {
            const playersData = data.players.map((player) => {
              return {
                username: player.username,
                isActive: player.is_active,
                isWinner: player.is_winner,
                figure: player.figure
              };
            });
            setRoomPlayers(playersData);
            setTotalPlayers(data.total_players);
            setPlayersTurn(data.players_turn);
            setBoardState(data.board_state);
            setGameState(data.game_state);
          })
          .catch(() => {
            window.close();
          });
      }, 50);
      if (data.command === 'click' && data.command !== 'restart') {
        setBoardState(data.value);
      }
    }
  });

  const boardElements = boardState.map((value, index) => (
    <div key={index} id={index} className="space">
      {value}
    </div>
  ));

  return (
    <div className="tictactoe-body tictactoe-monitoring">
      <MonitoringGameInfo
        roomName={roomName}
        gameState={gameState}
        totalPlayers={totalPlayers}
        playersTurn={playersTurn}
      />
      <div className="tictactoe-players">
        {roomPlayers.map((player) => (
          <div key={player.username}>
            <MonitoringPlayerInfo player={player} />
          </div>
        ))}
      </div>
      <div className="tictactoe-wrapper">
        <div className="tictactoe">
          <div className="board-wrapper">
            <div className="board">{boardElements}</div>
          </div>
        </div>
        <MonitoringChat websocket={websocket} username={username} />
      </div>
    </div>
  );
};

export default TicTacToeMonitoring;
