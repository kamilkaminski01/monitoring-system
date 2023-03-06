from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.utils import get_room_data

from .models import BingoPlayer, BingoRoom

channel_layer = get_channel_layer()


@receiver(post_save, sender=BingoPlayer)
def total_players_signal(sender, instance: BingoPlayer, **kwargs) -> None:
    bingo_room = instance.room
    active_players = BingoPlayer.objects.filter(room=bingo_room, is_active=True)
    if active_players.count() == 0:
        bingo_room.delete()
    else:
        BingoRoom.objects.filter(id=bingo_room.id).update(
            total_players=active_players.count()
        )


@receiver(post_save, sender=BingoRoom)
def create_room_signal(sender, instance: BingoRoom, **kwargs) -> None:
    async_to_sync(channel_layer.group_send)(
        "online_bingo_rooms",
        get_room_data(instance, "room_added"),
    )


@receiver(post_delete, sender=BingoRoom)
def delete_room_signal(sender, instance: BingoRoom, **kwargs) -> None:
    try:
        async_to_sync(channel_layer.group_send)(
            "online_bingo_rooms",
            get_room_data(instance, "room_deleted"),
        )
    except TypeError:
        print("FAILED DELETING BINGO ROOM")
