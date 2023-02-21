const url = window.location;
const isSecure = url.protocol === 'https:' ? 'wss:' : 'ws:';

export const API_URL =
  url.port !== '' ? `${url.protocol}//${url.hostname}:8000/api/` : `${url.origin}/api/`;

export const SOCKET_URL =
  url.port !== '' ? `${isSecure}//${url.hostname}:8000/ws` : `${isSecure}://${url.origin}/ws`;

export const ENDPOINTS = {
  getToken: 'token/',
  refreshToken: 'token/refresh/'
};

export const PATHS = {
  home: '/',
  login: '/login',
  monitoring: '/monitoring',
  whiteboard: '/whiteboard',
  bingo: '/bingo',
  tictactoe: '/tictactoe',
  socketWhiteboard: `${SOCKET_URL}/whiteboard`,
  socketBingoRooms: `${SOCKET_URL}/online-rooms/bingo/`,
  socketTicTacToeRooms: `${SOCKET_URL}/online-rooms/tictactoe/`
};

export const LOCAL_STORAGE = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};
