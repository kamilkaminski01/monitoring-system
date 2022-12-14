import os

from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
from django.core.asgi import get_asgi_application

import bingo.routing
import whiteboard.routing

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")


application = ProtocolTypeRouter(
    {
        "http": get_asgi_application(),
        "websocket": AuthMiddlewareStack(
            URLRouter(
                whiteboard.routing.websocket_urlpatterns
                + bingo.routing.websocket_urlpatterns
            )
        ),
    }
)
