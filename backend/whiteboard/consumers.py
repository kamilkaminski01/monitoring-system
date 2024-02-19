import logging

from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import Whiteboard, WhiteboardPlayer

logger = logging.getLogger(__name__)


class WhiteboardConsumer(GameConsumerMixin):
    game_model = Whiteboard
    player_model = WhiteboardPlayer

    async def receive_json(self, content: dict, **kwargs) -> None:
        await super().receive_json(content=content, **kwargs)
        if self.value:
            await self.update_whiteboard_state()
        elif self.command == "message":
            await self.clear_whiteboard_state()

    @database_sync_to_async
    def update_whiteboard_state(self) -> None:
        try:
            whiteboard = Whiteboard.objects.get(room_name=self.scope_room_name)
            whiteboard.board_state.append(self.value)
            whiteboard.save(update_fields=["board_state"])
        except Whiteboard.DoesNotExist:
            logger.warning("Whiteboard doesn't exist")

    @database_sync_to_async
    def clear_whiteboard_state(self) -> None:
        try:
            whiteboard = Whiteboard.objects.get(room_name=self.scope_room_name)
            whiteboard.board_state.clear()
            whiteboard.save(update_fields=["board_state"])
        except Whiteboard.DoesNotExist:
            logger.warning("Whiteboard doesn't exist")


class WhiteboardOnlineRoomsConsumer(OnlineRoomsConsumerMixin):
    game = "whiteboard"
    model = Whiteboard
