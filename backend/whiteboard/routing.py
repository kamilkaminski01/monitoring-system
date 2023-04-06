from django.urls import path

from .consumers import WhiteboardConsumer, WhiteboardOnlineRoomsConsumer

websocket_urlpatterns = [
    path("ws/whiteboard/<str:room_name>/", WhiteboardConsumer.as_asgi()),
    path("ws/online-rooms/whiteboard/", WhiteboardOnlineRoomsConsumer.as_asgi()),
]
