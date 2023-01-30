from typing import List

from django.db import models


def default_bingo_state() -> List:
    return ["", "", "", "", ""]


class BingoRoom(models.Model):
    room_name = models.CharField(max_length=50)
    players_limit = models.PositiveIntegerField(default=2)

    def __str__(self) -> str:
        return self.room_name


class TrackPlayers(models.Model):
    username = models.CharField(max_length=50)
    is_winner = models.BooleanField(default=False)
    # bingo_state = models.JSONField(default=default_bingo_state)
    room = models.ForeignKey(BingoRoom, on_delete=models.CASCADE)
