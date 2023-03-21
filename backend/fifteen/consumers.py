from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from backend.utils import websocket_send_event

from .models import FifteenPuzzle


class FifteenPuzzleConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.scope_user = self.scope["user"]
        self.scope_user_puzzle = self.scope["url_route"]["kwargs"]["username"]
        try:
            await self.channel_layer.group_add(
                self.scope_user_puzzle, self.channel_name
            )
        except TypeError:
            print("failed adding users fifteen puzzle")
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(
            self.scope_user_puzzle, self.channel_name
        )
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
        try:
            await self.channel_layer.group_send(self.scope_user_puzzle, data)
        except TypeError:
            print("failed sending to fifteen puzzle user")

    async def websocket_message(self, event: dict) -> None:
        field_names = ["command", "user", "message", "value"]
        try:
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass


class FifteenPuzzleOnlineUsersConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.puzzles = "online_puzzles"
        try:
            await self.channel_layer.group_add(self.puzzles, self.channel_name)
        except TypeError:
            print(f"failed adding {self.puzzles} to group")
        await self.get_puzzles()
        await self.channel_layer.group_send(
            self.puzzles,
            {
                "type": "websocket_online_puzzles",
                "command": "online_rooms",
                "online_puzzles": self.online_puzzles,
            },
        )
        await self.accept()

    async def websocket_online_puzzles(self, event: dict) -> None:
        field_names = ["command", "online_puzzles"]
        await websocket_send_event(self, event, field_names)

    async def websocket_puzzle_added_or_deleted(self, event: dict) -> None:
        field_names = ["command", "username", "username_id"]
        await websocket_send_event(self, event, field_names)

    async def disconnect(self, code: int) -> None:
        await self.channel_layer.group_discard(self.puzzles, self.channel_name)
        await super().disconnect(code)

    @database_sync_to_async
    def get_puzzles(self) -> None:
        self.online_puzzles = [
            {"username": user.username} for user in FifteenPuzzle.objects.all()
        ]
