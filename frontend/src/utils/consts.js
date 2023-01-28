const backendHome = 'http://localhost:8000';

export const PATHS = {
  home: '/',
  monitoring: '/monitoring/',
  whiteboard: '/whiteboard/',
  bingo: `${backendHome}/bingo/`,
  tictactoe: `${backendHome}/tictactoe/`,
  bingoBackendHome: `${backendHome}/bingo`,
  tictactoeBackendHome: `${backendHome}/tictactoe`,
  websocketBingoOnlineRooms: `ws://localhost:8000/ws/online-rooms/bingo/`,
  websocketTicTacToeOnlineRooms: `ws://localhost:8000/ws/online-rooms/tictactoe/`
};
