from django.urls import path

from .consumers import TicTacToeConsumer

websocket_urlpatterns = [
    path("ws/game/tictactoe/<room>", TicTacToeConsumer.as_asgi()),
]
