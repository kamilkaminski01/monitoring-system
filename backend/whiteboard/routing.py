from django.urls import path

from .consumers import BoardConsumer

websocket_urlpatterns = [
    path("", BoardConsumer.as_asgi())
]
