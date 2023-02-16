const url = window.location;
const splitUrl = url.pathname.split("/");
const app = splitUrl[1];
const appRoomName = splitUrl[2];

const homeUrl =
  url.port !== "" ? `${url.protocol}//${url.hostname}:8000/${app}` : `${url.origin}/${app}`;

const socketUrl =
  `${url.protocol === "https:" ? "wss" : "ws"}://${url.hostname}${url.port ? `:8000` : ""}/ws`;

const socketAppUrl = `${socketUrl}/${app}/${appRoomName}/`;
const socketRoomsUrl = `${socketUrl}/online-rooms/${app}/`;

const menuPageUrl = "http://localhost:3000/";
