from django.urls import path

from .consumers import BingoConsumer

websocket_urlpatterns = [
    path("ws/clicked/<room_name>/", BingoConsumer.as_asgi(), name="clicked")
]
