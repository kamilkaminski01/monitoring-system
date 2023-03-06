from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver

from backend.utils import send_room_signal, update_total_players

from .models import TicTacToePlayer, TicTacToeRoom


@receiver(post_save, sender=TicTacToePlayer)
def total_tictactoe_players_signal(sender, instance: TicTacToePlayer, **kwargs) -> None:
    update_total_players(TicTacToeRoom, TicTacToePlayer, instance)


@receiver(post_save, sender=TicTacToeRoom)
def create_tictactoe_room_signal(sender, instance: TicTacToeRoom, **kwargs) -> None:
    send_room_signal("online_tictactoe_rooms", instance, "room_added")


@receiver(post_delete, sender=TicTacToeRoom)
def delete_tictactoe_room_signal(sender, instance: TicTacToeRoom, **kwargs) -> None:
    send_room_signal("online_tictactoe_rooms", instance, "room_deleted")
