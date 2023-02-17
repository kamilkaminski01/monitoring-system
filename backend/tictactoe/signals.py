from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import TicTacToeRoom

channel_layer = get_channel_layer()


@receiver(post_save, sender=TicTacToeRoom)
def create_room_signal(sender, instance: TicTacToeRoom, **kwargs) -> None:
    async_to_sync(channel_layer.group_send)(
        "online_tictactoe_room",
        {
            "type": "websocket_room_added_or_deleted",
            "command": "room_added",
            "room_name": instance.room_name,
            "room_id": instance.id,
        },
    )


@receiver(post_delete, sender=TicTacToeRoom)
def delete_room_signal(sender, instance: TicTacToeRoom, **kwargs) -> None:
    async_to_sync(channel_layer.group_send)(
        "online_tictactoe_room",
        {
            "type": "websocket_room_added_or_deleted",
            "command": "room_deleted",
            "room_name": instance.room_name,
            "room_id": instance.id,
        },
    )
