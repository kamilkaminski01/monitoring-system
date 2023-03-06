from django.urls import path

from .consumers import BingoConsumer, BingoOnlineRoomsConsumer

websocket_urlpatterns = [
    path("ws/bingo/<str:room_name>/", BingoConsumer.as_asgi()),
    path("ws/online-rooms/bingo/", BingoOnlineRoomsConsumer.as_asgi()),
]
