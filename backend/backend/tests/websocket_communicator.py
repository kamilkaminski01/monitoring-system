from typing import Type

from channels.generic.websocket import AsyncJsonWebsocketConsumer
from channels.testing import WebsocketCommunicator
from django.contrib.auth.models import AnonymousUser


class WebsocketGameCommunicator:
    @classmethod
    async def create_game_consumer(
        cls, consumer_class: Type[AsyncJsonWebsocketConsumer], game: str
    ) -> WebsocketCommunicator:
        communicator = WebsocketCommunicator(
            consumer_class.as_asgi(), f"/ws/{game}/test/"
        )
        communicator.scope["user"] = AnonymousUser
        communicator.scope["url_route"] = {
            "kwargs": {"room_name": "test", "username": "test"}
        }
        return communicator

    @classmethod
    async def create_online_objects_consumer(
        cls, consumer_class: Type[AsyncJsonWebsocketConsumer], objects: str, game: str
    ) -> WebsocketCommunicator:
        communicator = WebsocketCommunicator(
            consumer_class.as_asgi(), f"/ws/online-{objects}/{game}/"
        )
        return communicator
