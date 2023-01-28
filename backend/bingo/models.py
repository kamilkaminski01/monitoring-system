from django.db import models


class BingoRoom(models.Model):
    room_name = models.CharField(max_length=50)

    def __str__(self) -> str:
        return self.room_name


class TrackPlayers(models.Model):
    username = models.CharField(max_length=50)
    is_winner = models.BooleanField(default=False)
    room = models.ForeignKey(BingoRoom, on_delete=models.CASCADE)
