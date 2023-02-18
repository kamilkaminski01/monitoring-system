from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer

from backend.utils import websocket_send_event

from .models import TicTacToePlayer, TicTacToeRoom


class TicTacToeConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = f"tictactoe_room_{self.url_route}"
        self.channel_layer = get_channel_layer()
        await self.accept()
        await self.get_or_create_room()
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command", None)
        self.info = content.get("info", None)
        self.user = content.get("user", None)
        self.game_state = content.get("game_state", None)

        await self.update_or_retrieve_board_state()
        if board_state := content.get("board_state"):
            self.board_state = board_state
            await self.update_or_retrieve_board_state(True)

        if self.command == "joined":
            await self.create_player()
            await self.set_player_inactive_or_active(True)
            await self.get_players_count()
            if self.players_count < 2:
                await self.set_or_change_turn()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_joined",
                    "command": self.command,
                    "user": self.user,
                    "info": self.info,
                    "board_state": self.board_state,
                    "active_players_count": self.active_players_count,
                },
            )
        if self.command == "leave":
            await self.set_player_inactive_or_active(False)
            await self.get_players_count()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_leave",
                    "command": self.command,
                    "info": self.info,
                    "user": self.user,
                    "active_players_count": self.active_players_count,
                },
            )
        if self.command == "run":
            await self.set_or_change_turn()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_run",
                    "game_state": self.game_state,
                    "player": content.get("player", None),
                    "index": content.get("index", None),
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
        if self.command == "restart":
            self.board_state = [""] * 9
            await self.update_or_retrieve_board_state(True)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_restart",
                    "command": self.command,
                    "info": self.info,
                    "user": self.user,
                    "board_state": self.board_state,
                },
            )

    async def websocket_joined(self, event: dict) -> None:
        field_names = ["command", "user", "info", "board_state", "active_players_count"]
        await websocket_send_event(self, event, field_names)

    async def websocket_leave(self, event: dict) -> None:
        try:
            field_names = ["command", "user", "info", "active_players_count"]
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass

    async def websocket_restart(self, event: dict) -> None:
        field_names = ["command", "info", "user", "board_state"]
        await websocket_send_event(self, event, field_names)

    async def websocket_run(self, event: dict) -> None:
        field_names = ["game_state", "player", "index"]
        await websocket_send_event(self, event, field_names)

    async def websocket_chat(self, event: dict) -> None:
        field_names = ["command", "user", "chat"]
        await websocket_send_event(self, event, field_names)

    @database_sync_to_async
    def set_or_change_turn(self) -> None:
        room = TicTacToeRoom.objects.get(room_name=self.url_route)
        players = list(room.players.all().order_by("id"))
        if len(players) == 2 and room.players_turn:
            current_turn_player_index = players.index(room.players_turn)
            next_turn_player_index = (current_turn_player_index + 1) % len(players)
            next_turn_player = players[next_turn_player_index]
            TicTacToeRoom.objects.filter(room_name=self.url_route).update(
                players_turn=next_turn_player
            )
        else:
            TicTacToeRoom.objects.filter(room_name=self.url_route).update(
                players_turn=room.players.first()
            )

    @database_sync_to_async
    def update_or_retrieve_board_state(self, update: bool = None) -> None:
        if update:
            TicTacToeRoom.objects.filter(room_name=self.url_route).update(
                board_state=self.board_state
            )
        try:
            self.board_state = TicTacToeRoom.objects.get(
                room_name=self.url_route
            ).board_state
        except TicTacToeRoom.DoesNotExist:
            pass

    @database_sync_to_async
    def get_or_create_room(self) -> None:
        self.tictactoe_room, _ = TicTacToeRoom.objects.get_or_create(
            room_name=self.url_route
        )

    @database_sync_to_async
    def create_player(self) -> None:
        room = TicTacToeRoom.objects.get(room_name=self.url_route)
        if room.players.count() < 2:
            if self.user is not None:
                player = TicTacToePlayer.objects.create(
                    room=self.tictactoe_room, username=self.user, is_player=True
                )
                player.save()
                self.tictactoe_room.players.add(player)

    @database_sync_to_async
    def get_players_count(self) -> None:
        active_players = self.tictactoe_room.players.filter(is_active=True)
        self.players_count = TicTacToeRoom.objects.get(
            room_name=self.url_route
        ).players.count()
        self.active_players_count = active_players.count()
        if self.active_players_count == 0:
            if self.tictactoe_room is not None:
                self.tictactoe_room.delete()

    @database_sync_to_async
    def set_player_inactive_or_active(self, status: bool) -> None:
        try:
            player = self.tictactoe_room.players.get(username=self.user)
            player.is_active = status
            player.save()
        except (TicTacToePlayer.DoesNotExist, TicTacToePlayer.MultipleObjectsReturned):
            pass


class TicTacToeOnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        await self.accept()
        self.room_name = "online_tictactoe_room"
        self.channel_layer = get_channel_layer()
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.get_rooms()
        await self.channel_layer.group_send(
            self.room_name,
            {
                "type": "websocket_rooms",
                "command": "online_rooms",
                "online_rooms": self.online_rooms,
            },
        )

    async def websocket_rooms(self, event: dict) -> None:
        field_names = ["command", "online_rooms"]
        await websocket_send_event(self, event, field_names)

    async def websocket_room_added_or_deleted(self, event: dict) -> None:
        field_names = ["command", "room_name", "room_id"]
        await websocket_send_event(self, event, field_names)

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await super().disconnect(close_code)

    @database_sync_to_async
    def get_rooms(self) -> None:
        self.online_rooms = [
            {"room_name": room.room_name, "room_id": room.id}
            for room in TicTacToeRoom.objects.all()
        ]
