from django.urls import path

from .consumers import FifteenPuzzleConsumer, FifteenPuzzleOnlineUsersConsumer

websocket_urlpatterns = [
    path("ws/fifteen/<str:username>/", FifteenPuzzleConsumer.as_asgi()),
    path("ws/online-puzzles/fifteen/", FifteenPuzzleOnlineUsersConsumer.as_asgi()),
]
