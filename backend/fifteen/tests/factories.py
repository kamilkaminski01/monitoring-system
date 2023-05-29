import factory

from fifteen.models import FifteenPuzzle


class FifteenPuzzleFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = FifteenPuzzle

    username = "player"
    board_state = [[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [15, 14, 13, None]]
    game_state = True
    moves = 0
