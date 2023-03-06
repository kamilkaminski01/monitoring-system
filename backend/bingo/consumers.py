from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer

from backend.utils import websocket_send_event

from .models import BingoPlayer, BingoRoom


class BingoConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = f"bingo_room_{self.url_route}"
        try:
            await self.channel_layer.group_add(self.room_name, self.channel_name)
        except TypeError:
            print("FAILED ADDING BINGO ROOM IN CONNECT")
        await self.accept()

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await super().disconnect(close_code)

    async def receive_json(self, content: dict, **kwargs) -> None:
        print(content)
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
        if self.command == "join":
            await self.set_player_inactive_or_active(True)
        elif self.command == "leave":
            await self.set_player_inactive_or_active(False)
        elif self.command == "restart":
            await self.restart_game()
        elif self.command == "win":
            await self.set_game_state_off()
        try:
            await self.channel_layer.group_send(self.room_name, data)
        except TypeError:
            print("FAILED SENDING TO BINGO GROUP IN RECEIVE JSON")

    async def websocket_message(self, event: dict) -> None:
        field_names = ["command", "user", "message", "value"]
        try:
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass

    @database_sync_to_async
    def set_player_inactive_or_active(self, status: bool) -> None:
        try:
            room = BingoRoom.objects.get(room_name=self.url_route)
            player, created = BingoPlayer.objects.get_or_create(
                username=self.user, room=room
            )
            player.is_active = status
            if created:
                room.players.add(player)
                room.save()
            player.save()
        except (BingoPlayer.DoesNotExist, BingoRoom.DoesNotExist):
            print("BINGO PLAYER OR ROOM DOES NOT EXIST")

    @database_sync_to_async
    def restart_game(self) -> None:
        BingoRoom.objects.filter(room_name=self.url_route).update(
            game_state=True, board_state=[]
        )
        BingoRoom.objects.get(room_name=self.url_route).players.all().update(
            bingo_state=[], is_winner=False
        )

    @database_sync_to_async
    def set_game_state_off(self):
        BingoRoom.objects.filter(room_name=self.url_route).update(game_state=False)


class BingoOnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.rooms = "online_bingo_rooms"
        try:
            await self.channel_layer.group_add(self.rooms, self.channel_name)
        except TypeError:
            print("FAILED ADDING BINGO ROOM TO GROUP")
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
            print("FAILED DISCONNECTING FROM BINGO GROUP")
        await super().disconnect(code)

    @database_sync_to_async
    def get_rooms(self) -> None:
        self.online_rooms = [
            {"room_name": room.room_name, "room_id": room.id}
            for room in BingoRoom.objects.all()
        ]
