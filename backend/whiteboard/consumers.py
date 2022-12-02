from channels.exceptions import StopConsumer
from channels.consumer import AsyncConsumer


class BoardConsumer(AsyncConsumer):
    async def websocket_connect(self, event):
        self.board_room = "boardroom"

        await self.channel_layer.group_add(
            self.board_room,
            self.channel_name
        )
        await self.send({
            "type": "websocket.accept",
        })

    async def websocket_receive(self, event):
        initial_data = event.get("text", None)

        await self.channel_layer.group_send(
            self.board_room, {
                "type": "board_message",
                "text": initial_data
            }
        )

    async def board_message(self, event):
        await self.send({
            "type": "websocket.send",
            "text": event["text"]
        })

    async def websocket_disconnect(self, event):
        await self.send({
            "type": "websocket.close"
        })
        raise StopConsumer()
