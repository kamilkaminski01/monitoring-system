from typing import List

from django.db import models


def default_game_state() -> List:
    return ["", "", "", "", "", "", "", "", ""]


class TicTacToeRoom(models.Model):
    room_name = models.CharField(max_length=50)
    board_state = models.JSONField(default=default_game_state)

    def __str__(self) -> str:
        return self.room_name


class TrackPlayers(models.Model):
    username = models.CharField(max_length=50)
    room = models.ForeignKey(TicTacToeRoom, on_delete=models.CASCADE)
