import logging

from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from backend.mixins import OnlineUsersConsumerMixin
from backend.utils import websocket_send_event

from .models import FifteenPuzzle

logger = logging.getLogger(__name__)


class FifteenPuzzleConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.scope_user = self.scope["user"]
        self.username = self.scope["url_route"]["kwargs"]["username"]
        try:
            await self.channel_layer.group_add(self.username, self.channel_name)
        except TypeError:
            logger.error("Failed adding user to fifteen puzzle")
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        try:
            await self.channel_layer.group_discard(self.username, self.channel_name)
        except TypeError:
            logger.warning("Failed disconnecting from fifteen puzzle")
        await super().disconnect(close_code)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command")
        self.message = content.get("message")
        self.user = content.get("user")
        self.value = content.get("value")
        data = {
            "type": "websocket_message",
            "command": self.command,
            "user": self.user,
            "message": self.message,
            "value": self.value,
        }
        if self.command == "leave":
            await self.delete_game()
        elif self.command == "win":
            await self.set_game_state_off()
        try:
            await self.channel_layer.group_send(self.username, data)
        except TypeError:
            logger.error("Failed sending to fifteen puzzle user")

    async def websocket_message(self, event: dict) -> None:
        field_names = ["command", "user", "message", "value"]
        try:
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass

    @database_sync_to_async
    def delete_game(self) -> None:
        try:
            game = FifteenPuzzle.objects.get(username=self.user)
            game.delete()
        except FifteenPuzzle.DoesNotExist:
            logger.warning("Fifteen puzzle doesn't exist")

    @database_sync_to_async
    def set_game_state_off(self) -> None:
        FifteenPuzzle.objects.filter(username=self.username).update(game_state=False)


class FifteenPuzzleOnlineUsersConsumer(OnlineUsersConsumerMixin):
    app = "fifteen_puzzle"
    model = FifteenPuzzle
