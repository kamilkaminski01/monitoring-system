from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import TicTacToePlayer, TicTacToeRoom, default_board_state


class TicTacToeConsumer(GameConsumerMixin):
    game_model = TicTacToeRoom
    player_model = TicTacToePlayer

    async def receive_json(self, content: dict, **kwargs) -> None:
        await super().receive_json(content, **kwargs)
        if self.scope_user.is_anonymous:
            if self.command == "join":
                await self.set_player_inactive_or_active(True)
            elif self.command == "leave":
                await self.set_player_inactive_or_active(False)
            elif self.command == "restart":
                await self.restart_game()
            elif self.command == "message":
                return
            try:
                await self.channel_layer.group_send(self.room_name, self.data)
            except TypeError:
                print(f"failed sending to {self.game_model}")

    @database_sync_to_async
    def set_player_inactive_or_active(self, status: bool) -> None:
        try:
            room = TicTacToeRoom.objects.get(room_name=self.scope_room_name)
            player, created = TicTacToePlayer.objects.get_or_create(
                username=self.user, room=room
            )
            if created:
                if room.players.all().count() == 1:
                    player.figure = "X"
                room.players.add(player)
                room.players.set(room.players.all())
            player.is_active = status
            player.save()
        except TicTacToeRoom.DoesNotExist:
            print("tic tac toe room does not exist")

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
