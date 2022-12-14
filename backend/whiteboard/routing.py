from django.urls import path

from .consumers import BoardConsumer

websocket_urlpatterns = [path("whiteboard", BoardConsumer.as_asgi())]
