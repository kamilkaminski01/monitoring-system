from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.utils import send_user_signal

from .models import FifteenPuzzle


@receiver(post_save, sender=FifteenPuzzle)
def create_fifteen_puzzle_signal(sender, instance: FifteenPuzzle, **kwargs) -> None:
    send_user_signal("online_fifteen_puzzle_users", instance, "user_added")


@receiver(post_delete, sender=FifteenPuzzle)
def delete_fifteen_puzzle_signal(sender, instance: FifteenPuzzle, **kwargs) -> None:
    send_user_signal("online_fifteen_puzzle_users", instance, "user_deleted")
