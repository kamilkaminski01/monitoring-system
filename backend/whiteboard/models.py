from django.db import models


class Whiteboard(models.Model):
    room_name = models.CharField(max_length=50)
    total_players = models.PositiveIntegerField(default=0)
    players = models.ManyToManyField("WhiteboardPlayer", related_name="players")
    board_state = models.JSONField(default=list)

    def __str__(self) -> str:
        return self.room_name


class WhiteboardPlayer(models.Model):
    room = models.ForeignKey(Whiteboard, on_delete=models.CASCADE)
    username = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.username
