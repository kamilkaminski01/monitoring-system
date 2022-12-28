from django.urls import path

from .consumers import TicTacToeConsumer, TicTacToeOnlineRoomConsumer

websocket_urlpatterns = [
    path("ws/game/tictactoe/<room>", TicTacToeConsumer.as_asgi(), name="tictactoe"),
    path(
        "ws/monitoring/tictactoe",
        TicTacToeOnlineRoomConsumer.as_asgi(),
        name="tictactoe-online-rooms",
    ),
]
