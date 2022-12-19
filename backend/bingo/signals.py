from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from .models import BingoRoom

channel_layer = get_channel_layer()


@receiver(post_save, sender=BingoRoom)
def create_room_signal(sender, instance: BingoRoom, created: bool, **kwargs) -> None:
    if created:
        async_to_sync(channel_layer.group_send)(
            "online_bingo_room",
            {
                "type": "websocket_room_added",
                "command": "room_added",
                "room_name": instance.room_name,
                "room_id": instance.id,
            },
        )


@receiver(post_delete, sender=BingoRoom)
def delete_room_signal(sender, instance: BingoRoom, **kwargs) -> None:
    async_to_sync(channel_layer.group_send)(
        "online_bingo_room",
        {
            "type": "websocket_room_deleted",
            "command": "room_deleted",
            "room_name": instance.room_name,
            "room_id": instance.id,
        },
    )
