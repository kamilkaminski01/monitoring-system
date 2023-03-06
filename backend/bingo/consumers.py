from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import BingoPlayer, BingoRoom


class BingoConsumer(GameConsumerMixin):
    game_room_model = BingoRoom
    player_model = BingoPlayer

    async def receive_json(self, content: dict, **kwargs) -> None:
        await super().receive_json(content, **kwargs)
        if self.command == "join":
            await self.set_player_inactive_or_active(True)
        elif self.command == "leave":
            await self.set_player_inactive_or_active(False)
        elif self.command == "restart":
            await self.restart_game()

    @database_sync_to_async
    def set_player_inactive_or_active(self, status: bool) -> None:
        try:
            room = BingoRoom.objects.get(room_name=self.url_route)
            player, created = BingoPlayer.objects.get_or_create(
                username=self.user, room=room
            )
            if created:
                room.players.add(player)
                room.save()
            player.is_active = status
            player.save()
        except BingoRoom.DoesNotExist:
            print("bingo room does not exist")

    @database_sync_to_async
    def restart_game(self) -> None:
        BingoRoom.objects.filter(room_name=self.url_route).update(
            game_state=True, board_state=[]
        )
        BingoRoom.objects.get(room_name=self.url_route).players.all().update(
            bingo_state=[], is_winner=False
        )


class BingoOnlineRoomsConsumer(OnlineRoomsConsumerMixin):
    room_type = "bingo"
    model = BingoRoom
