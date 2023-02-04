const backendHome = 'http://localhost:8000';

const url = window.location;
export const API_URL =
  url.port !== '' ? `${url.protocol}//${url.hostname}:8000/api/` : `${url.origin}/api/`;

export const ENDPOINTS = {
  getToken: 'token/',
  refreshToken: 'token/refresh/'
};

export const PATHS = {
  home: '/',
  login: '/login',
  monitoring: '/monitoring/',
  whiteboard: '/whiteboard/',
  bingo: `${backendHome}/bingo/`,
  tictactoe: `${backendHome}/tictactoe/`,
  websocketWhiteboard: `ws://localhost:8000/whiteboard`,
  websocketBingoOnlineRooms: `ws://localhost:8000/ws/online-rooms/bingo/`,
  websocketTicTacToeOnlineRooms: `ws://localhost:8000/ws/online-rooms/tictactoe/`
};

export const LOCAL_STORAGE = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};
