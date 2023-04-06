from backend.mixins import GameConsumerMixin, OnlineRoomsConsumerMixin

from .models import Whiteboard, WhiteboardPlayer


class WhiteboardConsumer(GameConsumerMixin):
    game_model = Whiteboard
    player_model = WhiteboardPlayer


class WhiteboardOnlineRoomsConsumer(OnlineRoomsConsumerMixin):
    game = "whiteboard"
    model = Whiteboard
