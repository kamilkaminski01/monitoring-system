from django.db import models


class Game(models.Model):
    room = models.CharField(max_length=100)
    host = models.CharField(max_length=100)
    opponent = models.CharField(max_length=100, blank=True, null=True)
    is_over = models.BooleanField(default=False)
