from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import BingoPlayer, BingoRoom


class BingoConsumer(GameConsumerMixin):
    game_model = BingoRoom
    player_model = BingoPlayer

    @database_sync_to_async
    def restart_game(self) -> None:
        BingoRoom.objects.filter(room_name=self.scope_room_name).update(
            game_state=True, board_state=[]
        )
        BingoRoom.objects.get(room_name=self.scope_room_name).players.all().update(
            bingo_state=[], is_winner=False
        )


class BingoOnlineRoomsConsumer(OnlineRoomsConsumerMixin):
    game = "bingo"
    model = BingoRoom
