import os

import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import bingo.routing
import fifteen.routing
import tictactoe.routing
import whiteboard.routing

from .middleware import JwtAuthMiddlewareStack

application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": JwtAuthMiddlewareStack(
            URLRouter(
                whiteboard.routing.websocket_urlpatterns
                + bingo.routing.websocket_urlpatterns
                + tictactoe.routing.websocket_urlpatterns
                + fifteen.routing.websocket_urlpatterns
            )
        ),
    }
)
