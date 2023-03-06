from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.utils import get_room_data

from .models import TicTacToePlayer, TicTacToeRoom

channel_layer = get_channel_layer()


@receiver(post_save, sender=TicTacToePlayer)
def total_players_signal(sender, instance: TicTacToePlayer, **kwargs) -> None:
    tictactoe_room = instance.room
    active_players = TicTacToePlayer.objects.filter(room=tictactoe_room, is_active=True)
    if active_players.count() == 0:
        tictactoe_room.delete()
    else:
        TicTacToeRoom.objects.filter(id=tictactoe_room.id).update(
            total_players=active_players.count()
        )


@receiver(post_save, sender=TicTacToeRoom)
def create_room_signal(sender, instance: TicTacToeRoom, **kwargs) -> None:
    async_to_sync(channel_layer.group_send)(
        "online_tictactoe_rooms", get_room_data(instance, "room_added")
    )


@receiver(post_delete, sender=TicTacToeRoom)
def delete_room_signal(sender, instance: TicTacToeRoom, **kwargs) -> None:
    try:
        async_to_sync(channel_layer.group_send)(
            "online_tictactoe_rooms", get_room_data(instance, "room_deleted")
        )
    except TypeError:
        print("FAILED DELETING TIC TAC TOE ROOM")
