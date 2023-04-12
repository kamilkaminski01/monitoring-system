from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import Whiteboard, WhiteboardPlayer


class WhiteboardConsumer(GameConsumerMixin):
    game_model = Whiteboard
    player_model = WhiteboardPlayer

    async def connect(self) -> None:
        await super().connect()
        self.whiteboard = await self.get_whiteboard()

    async def receive_json(self, content: dict, **kwargs) -> None:
        await super().receive_json(content=content, **kwargs)
        if self.value:
            await self.update_whiteboard_state()
        elif self.command == "message":
            await self.clear_whiteboard_state()

    @database_sync_to_async
    def update_whiteboard_state(self) -> None:
        self.whiteboard.board_state.append(self.value)
        self.whiteboard.save(update_fields=["board_state"])

    @database_sync_to_async
    def clear_whiteboard_state(self) -> None:
        self.whiteboard.board_state.clear()
        self.whiteboard.save(update_fields=["board_state"])

    @database_sync_to_async
    def get_whiteboard(self) -> Whiteboard:
        return Whiteboard.objects.get(room_name=self.scope_room_name)


class WhiteboardOnlineRoomsConsumer(OnlineRoomsConsumerMixin):
    game = "whiteboard"
    model = Whiteboard
