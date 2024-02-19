import logging
from typing import Type

from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from .utils import websocket_send_event

logger = logging.getLogger(__name__)


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
            logger.error("Failed adding: %s", self.game_model.__name__)
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        try:
            await self.channel_layer.group_discard(self.room_name, self.channel_name)
        except TypeError:
            logger.warning("Failed disconnecting from game")
        await super().disconnect(close_code)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command")
        self.message = content.get("message")
        self.user = content.get("user")
        self.value = content.get("value")
        self.data = {
            "type": "websocket_message",
            "command": self.command,
            "user": self.user,
            "message": self.message,
            "value": self.value,
        }
        if self.command == "join":
            await self.set_player_inactive_or_active(True)
        elif self.command == "leave":
            await self.set_player_inactive_or_active(False)
        elif self.command == "restart":
            await self.restart_game()
        elif self.command == "ready":
            if await self.check_players_ready_state():
                await self.restart_game()
                self.data["command"] = "restart"
                self.data["message"] = "The game has restarted"
        if self.command == "win" or self.command == "over":
            await self.set_game_state_off()
            await self.set_users_ready_state_off()
        try:
            await self.channel_layer.group_send(self.room_name, self.data)
        except TypeError:
            logger.error("Failed sending to: %s", self.game_model.__name__)

    async def websocket_message(self, event: dict) -> None:
        field_names = ["command", "user", "message", "value"]
        try:
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass

    @database_sync_to_async
    def set_player_inactive_or_active(self, status: bool) -> None:
        try:
            room = self.game_model.objects.get(room_name=self.scope_room_name)
            player = self.player_model.objects.get(username=self.user, room=room)
            player.is_active = status
            player.save()
        except (self.game_model.DoesNotExist, self.player_model.DoesNotExist):
            logger.error(
                "%s or %s doesn't exist"
                % (self.game_model.__name__, self.player_model.__name__)
            )

    @database_sync_to_async
    def set_game_state_off(self) -> None:
        self.game_model.objects.filter(room_name=self.scope_room_name).update(
            game_state=False
        )

    @database_sync_to_async
    def set_users_ready_state_off(self) -> None:
        self.game_model.objects.get(
            room_name=self.scope_room_name
        ).players.all().update(is_ready=False)

    @database_sync_to_async
    def check_players_ready_state(self) -> bool:
        if not self.game_model.objects.filter(
            room_name=self.scope_room_name, game_state=False
        ).exists():
            return False
        for player in self.player_model.objects.filter(
            room__room_name=self.scope_room_name
        ):
            if not player.is_ready:
                return False
        return True


class OnlineRoomsConsumerMixin(AsyncJsonWebsocketConsumer):
    game: str = ""
    model: Type = NotImplemented

    async def connect(self) -> None:
        self.rooms = f"online_{self.game}_rooms"
        try:
            await self.channel_layer.group_add(self.rooms, self.channel_name)
        except TypeError:
            logger.error("Failed adding %s to group", self.game)
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
        try:
            await self.channel_layer.group_discard(self.rooms, self.channel_name)
        except TypeError:
            logger.warning("Failed disconnecting from online rooms")
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
            logger.error("Failed adding %s to group", self.users)
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
        try:
            await self.channel_layer.group_discard(self.users, self.channel_name)
        except TypeError:
            logger.warning("Failed disconnecting from online users")
        await super().disconnect(code)

    @database_sync_to_async
    def get_users(self) -> None:
        self.online_users = [
            {"username": user.username} for user in self.model.objects.all()
        ]
