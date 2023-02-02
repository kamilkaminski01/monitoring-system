from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import BingoRoom, TrackPlayers


class BingoConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super(BingoConsumer, self).__init__(args, kwargs)
        self.url_route = None
        self.room_name = None
        self.bingo_room = None
        self.command = None
        self.info = None
        self.user = None
        self.data_id = None
        self.data_set = None
        self.winners = None
        self.players_number_count = None
        self.players_username_count = None

    async def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = f"bingo_room_{self.url_route}"
        await self.accept()
        await self.create_room()
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command", None)
        self.info = content.get("info", None)
        self.user = content.get("user", None)
        self.data_id = content.get("dataID", None)
        self.data_set = content.get("dataset", None)
        if players_limit := content.get("players_limit"):
            self.players_limit = players_limit

        if self.command == "room_created":
            await self.set_players_limit()

        if self.command == "clicked":
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_info",
                    "user": self.user,
                    "dataID": self.data_id,
                    "dataset": self.data_set,
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
        if self.command == "win":
            await self.get_winners()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_win",
                    "command": self.command,
                    "winners": self.winners,
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
                    "user": self.user,
                    "info": self.info,
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

    async def websocket_info(self, event: dict) -> None:
        await self.send_json(
            (
                {
                    "command": "clicked",
                    "user": event["user"],
                    "dataID": int(event["dataID"]),
                    "dataset": int(event["dataset"]),
                }
            )
        )

    async def websocket_win(self, event: dict) -> None:
        await self.send_json(
            (
                {
                    "command": "win",
                    "winners": event["winners"],
                    "user": event["user"],
                    "info": event["info"],
                }
            )
        )

    async def websocket_chat(self, event: dict) -> None:
        await self.send_json(
            (
                {
                    "user": event["user"],
                    "chat": event["chat"],
                    "command": event["command"],
                }
            )
        )

    async def websocket_joined(self, event: dict) -> None:
        await self.players_count()
        await self.get_players_limit()
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "user": event["user"],
                    "info": event["info"],
                    "players_limit": self.players_limit,
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
                    "command": "joined",
                    "user": event["user"],
                    "info": event["info"],
                    "players_number_count": self.players_number_count,
                    "players_username_count": self.players_username_count,
                }
            )
        )

    @database_sync_to_async
    def get_players_limit(self) -> None:
        self.players_limit = BingoRoom.objects.get(
            room_name=self.url_route
        ).players_limit

    @database_sync_to_async
    def set_players_limit(self) -> None:
        BingoRoom.objects.filter(room_name=self.url_route).update(
            players_limit=self.players_limit
        )
        self.get_players_limit()

    @database_sync_to_async
    def create_room(self) -> None:
        self.bingo_room, _ = BingoRoom.objects.get_or_create(room_name=self.url_route)

    @database_sync_to_async
    def create_players(self, username: str) -> None:
        TrackPlayers.objects.get_or_create(room=self.bingo_room, username=username)

    @database_sync_to_async
    def players_count(self) -> None:
        self.players_number_count = self.bingo_room.trackplayers_set.all().count()
        self.players_username_count = [
            x.username for x in self.bingo_room.trackplayers_set.all()
        ]

    @database_sync_to_async
    def delete_player(self) -> None:
        try:
            TrackPlayers.objects.get(room=self.bingo_room, username=self.user).delete()
        except TrackPlayers.DoesNotExist:
            pass
        players_count = self.bingo_room.trackplayers_set.all().count()
        if players_count == 0:
            self.bingo_room.delete()

    @database_sync_to_async
    def get_winners(self) -> None:
        TrackPlayers.objects.filter(username=self.user).update(is_winner=True)
        self.winners = [x.username for x in TrackPlayers.objects.filter(is_winner=True)]


class BingoOnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super(BingoOnlineRoomConsumer, self).__init__(args, kwargs)
        self.room_name = None
        self.online_rooms = None

    async def connect(self) -> None:
        await self.accept()
        self.room_name = "online_bingo_room"
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
            for x in BingoRoom.objects.all()
        ]
