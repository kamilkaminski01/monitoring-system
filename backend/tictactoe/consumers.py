from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import TicTacToeRoom, TrackPlayers


class TicTacToeConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super(TicTacToeConsumer, self).__init__(args, kwargs)
        self.tictactoe_room = None
        self.url_route = None
        self.room_name = None
        self.command = None
        self.info = None
        self.user = None
        self.players_number_count = None
        self.players_username_count = None

    async def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = f"tictactoe_room_{self.url_route}"
        await self.accept()
        await self.create_room()
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command", None)
        self.info = content.get("info", None)
        self.user = content.get("user", None)

        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "websocket_run_game",
                "payload": content,
            },
        )

        if self.command == "joined":
            await self.create_players(self.user)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_joined",
                    "command": self.command,
                    "user": self.user,
                    "info": self.info,
                },
            )
        if self.command == "leave":
            await self.delete_player()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_leave",
                    "command": self.command,
                    "info": self.info,
                    "user": self.user,
                },
            )
        if self.command == "chat":
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_chat",
                    "command": self.command,
                    "chat": content.get("chat", None),
                    "user": content.get("user", None),
                },
            )

    async def websocket_run_game(self, event: dict) -> None:
        await self.send_json({"payload": event["payload"]})

    async def websocket_chat(self, event: dict) -> None:
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "user": event["user"],
                    "chat": event["chat"],
                }
            )
        )

    async def websocket_joined(self, event: dict) -> None:
        await self.players_count()
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "info": event["info"],
                    "user": event["user"],
                    "players_number_count": self.players_number_count,
                    "players_username_count": self.players_username_count,
                }
            )
        )

    async def websocket_leave(self, event: dict) -> None:
        await self.players_count()
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "info": event["info"],
                    "user": event["user"],
                    "players_number_count": self.players_number_count,
                    "players_username_count": self.players_username_count,
                }
            )
        )

    @database_sync_to_async
    def create_room(self) -> None:
        self.tictactoe_room, _ = TicTacToeRoom.objects.get_or_create(
            room_name=self.url_route
        )

    @database_sync_to_async
    def create_players(self, username: str) -> None:
        TrackPlayers.objects.get_or_create(room=self.tictactoe_room, username=username)

    @database_sync_to_async
    def players_count(self) -> None:
        self.players_number_count = self.tictactoe_room.trackplayers_set.all().count()
        self.players_username_count = [
            x.username for x in self.tictactoe_room.trackplayers_set.all()
        ]

    @database_sync_to_async
    def delete_player(self) -> None:
        TrackPlayers.objects.get(room=self.tictactoe_room, username=self.user).delete()
        players_count = self.tictactoe_room.trackplayers_set.all().count()
        if players_count == 0:
            self.tictactoe_room.delete()


class TicTacToeOnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super(TicTacToeOnlineRoomConsumer, self).__init__(args, kwargs)
        self.room_name = None
        self.online_rooms = None

    async def connect(self) -> None:
        await self.accept()
        self.room_name = "online_tictactoe_room"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.online_room()
        await self.channel_layer.group_send(
            self.room_name,
            {"type": "websocket_rooms", "online_rooms": self.online_rooms},
        )

    async def websocket_rooms(self, event: dict) -> None:
        await self.send_json(
            ({"command": "online_rooms", "online_rooms": self.online_rooms})
        )

    async def websocket_room_added(self, event: dict) -> None:
        await self.online_room()
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "room_name": event["room_name"],
                    "room_id": event["room_id"],
                }
            )
        )

    async def websocket_room_deleted(self, event: dict) -> None:
        await self.online_room()
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "room_name": event["room_name"],
                    "room_id": event["room_id"],
                }
            )
        )

    async def receive_json(self, content: dict, **kwargs) -> None:
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code: int) -> None:
        return await super().disconnect(code)

    @database_sync_to_async
    def online_room(self) -> None:
        self.online_rooms = [
            {"room_name": x.room_name, "room_id": f"{x.room_name}-{x.id}"}
            for x in TicTacToeRoom.objects.all()
        ]
