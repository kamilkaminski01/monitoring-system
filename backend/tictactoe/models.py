from typing import List

from django.db import models


def default_board_state() -> List:
    return ["", "", "", "", "", "", "", "", ""]


class TicTacToeRoom(models.Model):
    room_name = models.CharField(max_length=50)
    game_state = models.BooleanField(default=False)
    total_players = models.PositiveIntegerField(default=0)
    board_state = models.JSONField(default=default_board_state)
    players = models.ManyToManyField(
        "TicTacToePlayer",
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
    figure = models.CharField(max_length=1, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    is_winner = models.BooleanField(default=False)
    is_ready = models.BooleanField(default=False)

    def __str__(self) -> str:
        return self.username
