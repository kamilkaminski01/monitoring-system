import json
from typing import Any

from asgiref.sync import async_to_sync
from channels.generic.websocket import AsyncJsonWebsocketConsumer, WebsocketConsumer

from .models import Game


class TicTacToeConsumer(WebsocketConsumer):
    def connect(self) -> None:
        self.url_route = self.scope["url_route"]["kwargs"]["room"]
        self.room = f"room_{self.url_route}"

        async_to_sync(self.channel_layer.group_add)(self.room, self.channel_name)
        self.accept()

    def receive(self, text_data: str) -> None:
        async_to_sync(self.channel_layer.group_send)(
            self.room,
            {
                "type": "run_game",
                "payLoad": text_data,
            },
        )

    def run_game(self, event: dict) -> None:
        data = event["payLoad"]
        data = json.loads(data)
        self.send(text_data=json.dumps({"payLoad": data["data"]}))

    def disconnect(self, code: Any) -> None:
        async_to_sync(self.channel_layer.group_discard)(self.room, self.channel_name)


class TicTacToeOnlineRoomConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self) -> None:
        await self.accept()
        self.room_name = "online_tictactoe_room"
        await self.channel_layer.group_add(self.room_name, self.channel_name)
        await self.send_online_rooms()

    async def receive_json(self, content: dict, **kwargs) -> None:
        return await super().receive_json(content, **kwargs)

    async def disconnect(self, code: Any) -> None:
        return await super().disconnect(code)

    async def send_online_rooms(self) -> None:
        online_rooms = [
            {"room_name": game.room, "room_id": f"{game.room}-{game.id}"}
            for game in Game.objects.filter(is_over=False)
        ]
        await self.send_json({"type": "websocket_rooms", "online_rooms": online_rooms})
