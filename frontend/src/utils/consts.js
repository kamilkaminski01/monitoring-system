const url = window.location;
const isSecure = url.protocol === 'https:' ? 'wss:' : 'ws:';

export const API_URL =
  url.port !== '' ? `${url.protocol}//${url.hostname}:8000/api/` : `${url.origin}/api/`;

export const SOCKET_URL =
  url.port !== '' ? `${isSecure}//${url.hostname}:8000/ws` : `${isSecure}//${url.origin}/ws`;

export const ENDPOINTS = {
  getToken: 'token/',
  refreshToken: 'token/refresh/',

  createBingoRoom: 'bingo/details/',
  detailsBingoRoom: 'bingo/details/:room_name/',
  checkBingoRoom: 'bingo/check/:room_name/',

  createTicTacToeRoom: 'tictactoe/details/',
  detailsTicTacToeRoom: 'tictactoe/details/:room_name/',
  checkTicTacToeRoom: 'tictactoe/check/:room_name/'
};

export const WEBSOCKETS = {
  whiteboard: `${SOCKET_URL}/whiteboard`,
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
