const url = window.location;
const isSecure = url.protocol === 'https:' ? 'wss:' : 'ws:';

export const API_URL =
  url.port !== '' ? `${url.protocol}//${url.hostname}:8000/api/` : `${url.origin}/api/`;

export const SOCKET_URL =
  url.port !== '' ? `${isSecure}//${url.hostname}:8000/ws` : `${isSecure}//${url.hostname}/ws`;

export const ENDPOINTS = {
  getToken: 'token/',
  refreshToken: 'token/refresh/',

  createBingoRoom: 'bingo/details/',
  detailsBingoRoom: 'bingo/details/:room_name/',
  detailsBingoPlayer: 'bingo/details/:room_name/:username/',
  checkBingoRoom: 'bingo/check/:room_name/',

  createTicTacToeRoom: 'tictactoe/details/',
  detailsTicTacToeRoom: 'tictactoe/details/:room_name/',
  detailsTicTacToePlayer: 'tictactoe/details/:room_name/:username/',
  checkTicTacToeRoom: 'tictactoe/check/:room_name/'
};

export const WEBSOCKETS = {
  whiteboard: `${SOCKET_URL}/whiteboard`,
  bingo: `${SOCKET_URL}/bingo`,
  tictactoe: `${SOCKET_URL}/tictactoe`,
  bingoOnlineRooms: `${SOCKET_URL}/online-rooms/bingo/`,
  tictactoeOnlineRooms: `${SOCKET_URL}/online-rooms/tictactoe/`
};

export const PATHS = {
  home: '/',
  login: '/login',
  monitoring: '/monitoring',
  whiteboard: '/whiteboard',
  bingo: '/bingo',
  tictactoe: '/tictactoe',
  bingoRoom: '/bingo/:room_name',
  tictactoeRoom: '/tictactoe/:room_name'
};

export const LOCAL_STORAGE = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken',
  username: 'username'
};

export const WEBSOCKET_MESSAGES = {
  join: (username) => ({
    command: 'join',
    user: username,
    message: `${username} just joined`
  }),
  leave: (username) => ({
    command: 'leave',
    user: username,
    message: `${username} left the room`
  }),
  win: (username) => ({
    command: 'win',
    user: username,
    message: `${username} won the game`
  }),
  click: (username, key) => ({
    command: 'click',
    user: username,
    value: key
  }),
  restart: (username) => ({
    command: 'restart',
    user: username,
    message: `${username} restarted the game`
  })
};

export const BINGO = {
  bingoWinRows: [
    [0, 1, 2, 3, 4],
    [5, 6, 7, 8, 9],
    [10, 11, 12, 13, 14],
    [15, 16, 17, 18, 19],
    [20, 21, 22, 23, 24],
    [0, 6, 12, 18, 24],
    [0, 5, 10, 15, 20],
    [1, 6, 11, 16, 21],
    [2, 7, 12, 17, 22],
    [3, 8, 13, 18, 23],
    [4, 9, 14, 19, 24],
    [4, 8, 12, 16, 20]
  ],
  bingoWinState: ['B', 'I', 'N', 'G', 'O']
};

export const TICTACTOE = {
  tictactoeWinRows: [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
};
