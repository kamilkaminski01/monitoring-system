from typing import List

from django.db import models


def default_board_state() -> List:
    return ["", "", "", "", "", "", "", "", ""]


class TicTacToeRoom(models.Model):
    room_name = models.CharField(max_length=50)
    board_state = models.JSONField(default=default_board_state)

    def __str__(self) -> str:
        return self.room_name


class TicTacToePlayer(models.Model):
    room = models.ForeignKey(TicTacToeRoom, on_delete=models.CASCADE)
    username = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.username
