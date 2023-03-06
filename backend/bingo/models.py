from django.db import models


class BingoRoom(models.Model):
    room_name = models.CharField(max_length=50)
    game_state = models.BooleanField(default=False)
    total_players = models.PositiveIntegerField(default=0)
    players_limit = models.PositiveIntegerField(default=2)
    board_state = models.JSONField(default=list)
    players = models.ManyToManyField(
        "BingoPlayer",
        related_name="players",
    )
    players_turn = models.ForeignKey(
        "BingoPlayer",
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name="players_turn",
    )

    def __str__(self) -> str:
        return self.room_name


class BingoPlayer(models.Model):
    room = models.ForeignKey(BingoRoom, on_delete=models.CASCADE)
    username = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    is_winner = models.BooleanField(default=False)
    initial_board_state = models.JSONField(default=list)
    bingo_state = models.JSONField(default=list)

    def __str__(self) -> str:
        return self.username
