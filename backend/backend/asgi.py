import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")  # flake8: noqa
django.setup()

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import bingo.routing
import tictactoe.routing
import whiteboard.routing

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                whiteboard.routing.websocket_urlpatterns
                + bingo.routing.websocket_urlpatterns
                + tictactoe.routing.websocket_urlpatterns
            )
        ),
    }
)
