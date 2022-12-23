from typing import Any

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .models import BingoRoom, TrackPlayers


class BingoConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room_name"]
        await self.accept()
        self.room_name = f"bingo_room_{self.url_route}"
        await self.create_room()
        self.user_left = ""
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def receive_json(self, content: dict, **kwargs) -> None:
        command = content.get("command", None)

        if command == "clicked":
            dataid = content.get("dataset", None)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_info",
                    "dataid": dataid,
                    "user": content.get("user", None),
                    "datatry": content.get("dataid", None),
                },
            )
        if command == "joined" or command == "won":
            info = content.get("info", None)
            user = content.get("user", None)

            await self.create_players(user)

            self.user_left = content.get("user", None)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_joined",
                    "info": info,
                    "user": user,
                    "command": command,
                    "bingoCount": content.get("bingoCount", "none"),
                },
            )
        if command == "chat":
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_chat",
                    "chat": content.get("chat", None),
                    "user": content.get("user", None),
                    "command": command,
                },
            )

    async def websocket_info(self, event: dict) -> None:
        await self.send_json(
            (
                {
                    "dataset": int(event["dataid"]),
                    "user": event["user"],
                    "dataid": int(event["datatry"]),
                    "command": "clicked",
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
        await self.send_json(
            (
                {
                    "command": event["command"],
                    "info": event["info"],
                    "user": event["user"],
                    "bingoCount": event.get("bingoCount"),
                    "users_count": self.players_count_all,
                    "all_players": self.all_players_for_room,
                }
            )
        )

    async def websocket_leave(self, event: dict) -> None:
        await self.players_count()
        await self.send_json(
            (
                {
                    "command": "joined",
                    "info": event["info"],
                    "users_count": self.players_count_all,
                    "all_players": self.all_players_for_room,
                }
            )
        )

    async def disconnect(self, close_code: Any) -> None:
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "websocket_leave",
                "info": f"{self.user_left} left the room",
            },
        )
        await self.delete_player()
        await self.channel_layer.group_discard(
            self.room_name,
            self.channel_name,
        )

    @database_sync_to_async
    def create_room(self) -> None:
        # fmt: off
        self.bingo_room,_ = BingoRoom.objects.get_or_create(room_name=self.url_route)  # noqa
        # fmt: on

    @database_sync_to_async
    def create_players(self, name: str) -> None:
        TrackPlayers.objects.get_or_create(room=self.bingo_room, username=name)

    @database_sync_to_async
    def players_count(self) -> None:
        self.all_players_for_room = [
            x.username for x in self.bingo_room.trackplayers_set.all()
        ]
        self.players_count_all = self.bingo_room.trackplayers_set.all().count()

    @database_sync_to_async
    def delete_player(self) -> None:
        TrackPlayers.objects.get(room=self.bingo_room, username=self.user_left).delete()
        players_count = self.bingo_room.trackplayers_set.all().count()
        if players_count == 0:
            self.bingo_room.delete()


class OnlineRoomConsumer(AsyncJsonWebsocketConsumer):
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

    async def disconnect(self, code: Any) -> None:
        return await super().disconnect(code)

    @database_sync_to_async
    def online_room(self) -> None:
        self.online_rooms = [
            {"room_name": x.room_name, "room_id": f"{x.room_name}-{x.id}"}
            for x in BingoRoom.objects.all()
        ]
