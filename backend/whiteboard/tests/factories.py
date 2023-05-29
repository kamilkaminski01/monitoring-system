from typing import List

import factory

from whiteboard.models import Whiteboard, WhiteboardPlayer


class WhiteboardFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = Whiteboard

    room_name = "whiteboard"
    total_players = 0
    board_state: List[dict] = []

    @factory.post_generation
    def players(self, create, extracted, **kwargs) -> None:
        if create and extracted:
            for player in extracted:
                self.players.add(player)


class WhiteboardPlayerFactory(factory.django.DjangoModelFactory):
    class Meta:
        model = WhiteboardPlayer

    username = "player"
    is_active = False
