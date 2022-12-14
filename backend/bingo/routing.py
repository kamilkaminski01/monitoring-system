from django.urls import path

from .consumers import BingoConsumer, OnlineRoomConsumer

websocket_urlpatterns = [
    path("ws/clicked/bingo/<room_name>/", BingoConsumer.as_asgi(), name="clicked"),
    path("ws/online-rooms/bingo/", OnlineRoomConsumer.as_asgi()),
]
