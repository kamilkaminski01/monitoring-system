import json
from typing import Any

from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer


class TicTacToeConsumer(WebsocketConsumer):
    def connect(self) -> None:
        self.room = self.scope["url_route"]["kwargs"]["room"]
        self.room_name = f"room_{self.room}"

        async_to_sync(self.channel_layer.group_add)(self.room_name, self.channel_name)
        self.accept()

    def receive(self, text_data: str) -> None:
        async_to_sync(self.channel_layer.group_send)(
            self.room_name,
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
        async_to_sync(self.channel_layer.group_discard)(
            self.room_name, self.channel_name
        )
