const url = window.location;

export const API_URL =
  url.port !== '' ? `${url.protocol}//${url.hostname}:8000/api/` : `${url.origin}/api/`;

export const HOME_URL = url.port !== '' ? `${url.protocol}//${url.hostname}:8000` : `${url.origin}`;

export const SOCKET_URL = `${url.protocol === 'https:' ? 'wss' : 'ws'}://${url.hostname}${
  url.port ? `:8000` : ''
}/ws`;

export const ENDPOINTS = {
  getToken: 'token/',
  refreshToken: 'token/refresh/'
};

export const PATHS = {
  home: '/',
  login: '/login',
  monitoring: '/monitoring',
  whiteboard: '/whiteboard',
  bingo: `${HOME_URL}/bingo`,
  tictactoe: `${HOME_URL}/tictactoe`,
  socketWhiteboard: `${SOCKET_URL}/whiteboard`,
  socketBingoRooms: `${SOCKET_URL}/online-rooms/bingo/`,
  socketTicTacToeRooms: `${SOCKET_URL}/online-rooms/tictactoe/`
};

export const LOCAL_STORAGE = {
  accessToken: 'accessToken',
  refreshToken: 'refreshToken'
};
