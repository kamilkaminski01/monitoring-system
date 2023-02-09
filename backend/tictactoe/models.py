from typing import List

from django.db import models


def default_board_state() -> List:
    return ["", "", "", "", "", "", "", "", ""]


class TicTacToeRoom(models.Model):
    room_name = models.CharField(max_length=50)
    board_state = models.JSONField(default=default_board_state)
    players = models.ManyToManyField(
        "TicTacToePlayer",
        limit_choices_to={"is_player": True},
        related_name="players",
    )
    players_turn = models.ForeignKey(
        "TicTacToePlayer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="players_turn",
    )

    def __str__(self) -> str:
        return self.room_name


class TicTacToePlayer(models.Model):
    room = models.ForeignKey(TicTacToeRoom, on_delete=models.CASCADE)
    username = models.CharField(max_length=50)
    is_player = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.username
