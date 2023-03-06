from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.utils import send_room_signal, update_total_players

from .models import BingoPlayer, BingoRoom


@receiver(post_save, sender=BingoPlayer)
def total_bingo_players_signal(sender, instance: BingoPlayer, **kwargs) -> None:
    update_total_players(BingoRoom, BingoPlayer, instance)


@receiver(post_save, sender=BingoRoom)
def create_bingo_room_signal(sender, instance: BingoRoom, **kwargs) -> None:
    send_room_signal("online_bingo_rooms", instance, "room_added")


@receiver(post_delete, sender=BingoRoom)
def delete_bingo_room_signal(sender, instance: BingoRoom, **kwargs) -> None:
    send_room_signal("online_bingo_rooms", instance, "room_deleted")
