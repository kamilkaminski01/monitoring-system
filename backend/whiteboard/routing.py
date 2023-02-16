from django.urls import path

from .consumers import BoardConsumer

websocket_urlpatterns = [path("ws/whiteboard", BoardConsumer.as_asgi())]
