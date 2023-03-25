from channels.db import database_sync_to_async

from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import BingoPlayer, BingoRoom


class BingoConsumer(GameConsumerMixin):
    game_model = BingoRoom
    player_model = BingoPlayer

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
            room = BingoRoom.objects.get(room_name=self.scope_room_name)
            player, created = BingoPlayer.objects.get_or_create(
                username=self.user, room=room
            )
            if created:
                room.players.add(player)
                room.players.set(room.players.all())
            player.is_active = status
            player.save()
        except BingoRoom.DoesNotExist:
            print("bingo room does not exist")

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
