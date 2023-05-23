from typing import List

import factory

from bingo.models import BingoPlayer, BingoRoom


class BingoRoomFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BingoRoom

    room_name = "BingoRoom"
    game_state = True
    total_players = 0
    players_limit = 2
    board_state: List[int] = []
    players_queue: List[str] = []

    @factory.post_generation
    def players(self, create, extracted, **kwargs) -> None:
        if create and extracted:
            for player in extracted:
                self.players.add(player)


class BingoPlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = BingoPlayer

    username = "player"
    is_active = True
    is_winner = False
    is_ready = False
    initial_board_state: List[int] = []
    bingo_state: List[str] = []
