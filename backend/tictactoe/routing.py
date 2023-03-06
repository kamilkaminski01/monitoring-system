from django.urls import path

from .consumers import TicTacToeConsumer, TicTacToeOnlineRoomsConsumer

websocket_urlpatterns = [
    path("ws/tictactoe/<str:room_name>/", TicTacToeConsumer.as_asgi()),
    path("ws/online-rooms/tictactoe/", TicTacToeOnlineRoomsConsumer.as_asgi()),
]
