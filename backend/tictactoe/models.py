from django.db import models


class TicTacToeRoom(models.Model):
    room_name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.room_name


class TrackPlayers(models.Model):
    username = models.CharField(max_length=50)
    room = models.ForeignKey(TicTacToeRoom, on_delete=models.CASCADE)
