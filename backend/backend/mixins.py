from typing import Type

from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .utils import websocket_send_event


class GameConsumerMixin(AsyncJsonWebsocketConsumer):
    game_model: Type = NotImplemented
    player_model: Type = NotImplemented

    async def connect(self) -> None:
        self.scope_user = self.scope["user"]
        self.scope_room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = (
            f"{self.game_model.__name__.lower()}_room_{self.scope_room_name}"
        )
        try:
            await self.channel_layer.group_add(self.room_name, self.channel_name)
        except TypeError:
            print(f"failed adding {self.game_model.__name__}")
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await super().disconnect(close_code)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command", None)
        self.message = content.get("message", None)
        self.user = content.get("user", None)
        self.value = content.get("value", None)
        data = {
            "type": "websocket_message",
            "command": self.command,
            "user": self.user,
            "message": self.message,
            "value": self.value,
        }
        if self.command == "win":
            await self.set_game_state_off()
        try:
            await self.channel_layer.group_send(self.room_name, data)
        except TypeError:
            print(f"failed sending to {self.game_model.__name__}")

    async def websocket_message(self, event: dict) -> None:
        field_names = ["command", "user", "message", "value"]
        try:
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass

    @database_sync_to_async
    def set_game_state_off(self) -> None:
        self.game_model.objects.filter(room_name=self.scope_room_name).update(
            game_state=False
        )


class OnlineRoomsConsumerMixin(AsyncJsonWebsocketConsumer):
    game: str = ""
    model: Type = NotImplemented

    async def connect(self) -> None:
        self.rooms = f"online_{self.game}_rooms"
        try:
            await self.channel_layer.group_add(self.rooms, self.channel_name)
        except TypeError:
            print(f"failed adding {self.game} to group")
        await self.get_rooms()
        await self.channel_layer.group_send(
            self.rooms,
            {
                "type": "websocket_rooms",
                "command": "online_rooms",
                "online_rooms": self.online_rooms,
            },
        )
        await self.accept()

    async def websocket_rooms(self, event: dict) -> None:
        field_names = ["command", "online_rooms"]
        await websocket_send_event(self, event, field_names)

    async def websocket_room_added_or_deleted(self, event: dict) -> None:
        field_names = ["command", "room_name", "room_id"]
        await websocket_send_event(self, event, field_names)

    async def disconnect(self, code: int) -> None:
        await self.channel_layer.group_discard(self.rooms, self.channel_name)
        await super().disconnect(code)

    @database_sync_to_async
    def get_rooms(self) -> None:
        self.online_rooms = [
            {"room_name": room.room_name, "room_id": room.id}
            for room in self.model.objects.all()
        ]


class OnlineUsersConsumerMixin(AsyncJsonWebsocketConsumer):
    app: str = ""
    model: Type = NotImplemented

    async def connect(self) -> None:
        self.users = f"online_{self.app}_users"
        try:
            await self.channel_layer.group_add(self.users, self.channel_name)
        except TypeError:
            print(f"failed adding {self.users} to group")
        await self.get_users()
        await self.channel_layer.group_send(
            self.users,
            {
                "type": "websocket_online_users",
                "command": "online_users",
                "online_users": self.online_users,
            },
        )
        await self.accept()

    async def websocket_online_users(self, event: dict) -> None:
        field_names = ["command", "online_users"]
        await websocket_send_event(self, event, field_names)

    async def websocket_user_added_or_deleted(self, event: dict) -> None:
        field_names = ["command", "username"]
        await websocket_send_event(self, event, field_names)

    async def disconnect(self, code: int) -> None:
        await self.channel_layer.group_discard(self.users, self.channel_name)
        await super().disconnect(code)

    @database_sync_to_async
    def get_users(self) -> None:
        self.online_users = [
            {"username": user.username} for user in self.model.objects.all()
        ]
