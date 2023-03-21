from django.db import models


class FifteenPuzzle(models.Model):
    username = models.CharField(max_length=50)
    board_state = models.JSONField(default=list)
    game_state = models.BooleanField(default=False)
    moves = models.PositiveIntegerField(default=0)

    def __str__(self) -> str:
        return self.username
