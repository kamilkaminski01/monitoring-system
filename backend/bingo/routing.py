from django.urls import path

from .consumers import BingoConsumer, BingoOnlineRoomConsumer

websocket_urlpatterns = [
    path("ws/bingo/<str:room_name>/", BingoConsumer.as_asgi(), name="bingo"),
    path(
        "ws/online-rooms/bingo/", BingoOnlineRoomConsumer.as_asgi(), name="online_rooms"
    ),
]
