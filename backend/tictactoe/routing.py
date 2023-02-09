from django.urls import path

from .consumers import TicTacToeConsumer, TicTacToeOnlineRoomConsumer

websocket_urlpatterns = [
    path(
        "ws/tictactoe/<str:room_name>/",
        TicTacToeConsumer.as_asgi(),
        name="tictactoe",
    ),
    path(
        "ws/online-rooms/tictactoe/",
        TicTacToeOnlineRoomConsumer.as_asgi(),
        name="online_rooms",
    ),
]
