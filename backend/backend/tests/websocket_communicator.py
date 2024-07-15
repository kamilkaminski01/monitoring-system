from channels.testing import WebsocketCommunicator
from django.contrib.auth.models import AnonymousUser


class WebsocketGameCommunicator:
    @classmethod
    async def create_game_consumer(cls, consumer_cls, game):
        communicator = WebsocketCommunicator(
            consumer_cls.as_asgi(),
            f"/ws/{game}/test/",
        )
        communicator.scope["user"] = AnonymousUser
        communicator.scope["url_route"] = {
            "kwargs": {
                "room_name": "test",
                "username": "test",
            }
        }
        return communicator

    @classmethod
    async def create_online_objects_consumer(cls, consumer_cls, objects, game):
        communicator = WebsocketCommunicator(
            consumer_cls.as_asgi(),
            f"/ws/online-{objects}/{game}/",
        )
        return communicator
