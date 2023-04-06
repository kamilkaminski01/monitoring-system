from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.utils import send_room_signal, update_total_players

from .models import Whiteboard, WhiteboardPlayer


@receiver(post_save, sender=WhiteboardPlayer)
def total_whiteboard_players_signal(
    sender, instance: WhiteboardPlayer, **kwargs
) -> None:
    update_total_players(Whiteboard, WhiteboardPlayer, instance)


@receiver(post_save, sender=Whiteboard)
def create_whiteboard_signal(sender, instance: Whiteboard, **kwargs) -> None:
    send_room_signal("online_whiteboard_rooms", instance, "room_added")


@receiver(post_delete, sender=Whiteboard)
def delete_whiteboard_signal(sender, instance: Whiteboard, **kwargs) -> None:
    send_room_signal("online_whiteboard_rooms", instance, "room_deleted")
