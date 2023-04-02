from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import TicTacToePlayer, TicTacToeRoom, default_board_state


class TicTacToeConsumer(GameConsumerMixin):
    game_model = TicTacToeRoom
    player_model = TicTacToePlayer

    @database_sync_to_async
    def restart_game(self) -> None:
        TicTacToeRoom.objects.filter(room_name=self.scope_room_name).update(
            game_state=True, board_state=default_board_state()
        )
        TicTacToeRoom.objects.get(room_name=self.scope_room_name).players.all().update(
            is_winner=False
        )


class TicTacToeOnlineRoomsConsumer(OnlineRoomsConsumerMixin):
    game = "tictactoe"
    model = TicTacToeRoom
