from autobahn.exception import Disconnected
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.layers import get_channel_layer

from backend.utils import websocket_send_event

from .models import BingoPlayer, BingoRoom


class BingoConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_name = f"bingo_room_{self.url_route}"
        self.channel_layer = get_channel_layer()
        await self.accept()
        await self.get_or_create_room()
        await self.channel_layer.group_add(self.room_name, self.channel_name)

    async def disconnect(self, close_code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await super().disconnect(close_code)

    async def receive_json(self, content: dict, **kwargs) -> None:
        self.command = content.get("command", None)
        self.info = content.get("info", None)
        self.user = content.get("user", None)
        self.data_id = content.get("data_id", None)
        self.data_set = content.get("data_set", None)
        if players_bingo_state := content.get("players_bingo_state"):
            self.players_bingo_state = players_bingo_state

        if self.command == "initialize_board":
            if initial_board_state := content.get("initial_board_state"):
                self.initial_board_state = initial_board_state
            await self.set_initial_board()

        if self.command == "update_bingo_state":
            await self.update_or_restart_players_bingo_state()

        if self.command == "clicked":
            await self.update_or_restart_board_state()
            await self.set_or_change_turn()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_info",
                    "command": self.command,
                    "user": self.user,
                    "data_id": self.data_id,
                    "data_set": self.data_set,
                },
            )
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
                    "active_players_count": self.active_players_count,
                },
            )
        if self.command == "win":
            await self.get_or_restart_winners()
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
            await self.set_player_inactive_or_active(False)
            await self.get_players_count()
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_leave",
                    "command": self.command,
                    "user": self.user,
                    "info": self.info,
                    "active_players_count": self.active_players_count,
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
            await self.update_or_restart_players_bingo_state(True)
            await self.update_or_restart_board_state(True)
            await self.get_or_restart_winners(True)
            await self.channel_layer.group_send(
                self.room_name,
                {
                    "type": "websocket_restart",
                    "command": self.command,
                    "info": self.info,
                    "user": self.user,
                },
            )

    async def websocket_joined(self, event: dict) -> None:
        field_names = ["command", "user", "info", "active_players_count"]
        await websocket_send_event(self, event, field_names)

    async def websocket_leave(self, event: dict) -> None:
        try:
            field_names = ["command", "user", "info", "active_players_count"]
            await websocket_send_event(self, event, field_names)
        except Disconnected:
            pass

    async def websocket_restart(self, event: dict) -> None:
        field_names = ["command", "info", "user"]
        await websocket_send_event(self, event, field_names)

    async def websocket_info(self, event: dict) -> None:
        field_names = ["command", "user", "data_id", "data_set"]
        await websocket_send_event(self, event, field_names)

    async def websocket_win(self, event: dict) -> None:
        field_names = ["command", "winners", "user", "info"]
        await websocket_send_event(self, event, field_names)

    async def websocket_chat(self, event: dict) -> None:
        field_names = ["command", "user", "chat"]
        await websocket_send_event(self, event, field_names)

    @database_sync_to_async
    def set_or_change_turn(self) -> None:
        room = BingoRoom.objects.get(room_name=self.url_route)
        players = list(room.players.all().order_by("id"))
        if len(players) == room.players_limit and room.players_turn:
            current_turn_player_index = players.index(room.players_turn)
            next_turn_player_index = (current_turn_player_index + 1) % len(players)
            next_turn_player = players[next_turn_player_index]
            BingoRoom.objects.filter(room_name=self.url_route).update(
                players_turn=next_turn_player
            )
        else:
            BingoRoom.objects.filter(room_name=self.url_route).update(
                players_turn=room.players.first()
            )

    @database_sync_to_async
    def set_initial_board(self) -> None:
        try:
            bingo_player = self.bingo_room.players.get(username=self.user)
            bingo_player.initial_board_state = self.initial_board_state
            bingo_player.save()
        except (BingoPlayer.DoesNotExist, BingoPlayer.MultipleObjectsReturned):
            pass

    @database_sync_to_async
    def update_or_restart_board_state(self, restart: bool = None) -> None:
        room = BingoRoom.objects.get(room_name=self.url_route)
        if restart:
            BingoRoom.objects.filter(room_name=self.url_route).update(board_state=[])
        else:
            if self.data_set not in room.board_state and self.data_set is not None:
                BingoRoom.objects.filter(room_name=self.url_route).update(
                    board_state=room.board_state + [self.data_set]
                )

    @database_sync_to_async
    def update_or_restart_players_bingo_state(self, restart: bool = None) -> None:
        if restart:
            players = self.bingo_room.players.all()
            for player in players:
                player.bingo_state = []
                player.save()
        else:
            player = self.bingo_room.players.get(username=self.user)
            player.bingo_state = self.players_bingo_state
            player.save()

    @database_sync_to_async
    def get_or_create_room(self) -> None:
        self.bingo_room, _ = BingoRoom.objects.get_or_create(room_name=self.url_route)

    @database_sync_to_async
    def create_player(self) -> None:
        room = BingoRoom.objects.get(room_name=self.url_route)
        players_queryset = room.players.filter(username=self.user)
        if not players_queryset.exists() and room.players.count() < room.players_limit:
            player = BingoPlayer.objects.create(
                room=self.bingo_room, username=self.user, is_player=True
            )
            player.save()
            self.bingo_room.players.add(player)

    @database_sync_to_async
    def get_players_count(self) -> None:
        active_players = self.bingo_room.players.filter(is_active=True)
        self.players_count = BingoRoom.objects.get(
            room_name=self.url_route
        ).players.count()
        self.active_players_count = active_players.count()
        if self.active_players_count == 0:
            if self.bingo_room is not None:
                self.bingo_room.delete()

    @database_sync_to_async
    def set_player_inactive_or_active(self, status: bool) -> None:
        try:
            player = self.bingo_room.players.get(username=self.user)
            player.is_active = status
            player.save()
        except (BingoPlayer.DoesNotExist, BingoPlayer.MultipleObjectsReturned):
            pass

    @database_sync_to_async
    def get_or_restart_winners(self, restart: bool = None) -> None:
        if restart:
            players = self.bingo_room.players.all()
            for player in players:
                player.is_winner = False
                player.save()
        else:
            bingo_player = self.bingo_room.players.get(username=self.user)
            bingo_player.is_winner = True
            bingo_player.save()
            self.winners = [
                x.username for x in self.bingo_room.players.filter(is_winner=True)
            ]


class BingoOnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        await self.accept()
        self.room_name = "online_bingo_room"
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

    async def disconnect(self, code: int) -> None:
        await self.channel_layer.group_discard(self.room_name, self.channel_name)
        await super().disconnect(code)

    @database_sync_to_async
    def get_rooms(self) -> None:
        self.online_rooms = [
            {"room_name": room.room_name, "room_id": room.id}
            for room in BingoRoom.objects.all()
        ]
