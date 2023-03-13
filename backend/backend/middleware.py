from channels.auth import AuthMiddlewareStack
from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework_simplejwt.authentication import JWTTokenUserAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from users.models import User


@database_sync_to_async
def get_user(validated_token):
    try:
        token_user = JWTTokenUserAuthentication().get_user(
            validated_token=validated_token
        )
        return User.objects.get(id=token_user.id)
    except User.DoesNotExist:
        return AnonymousUser()


class JwtAuthMiddleware(BaseMiddleware):
    def __init__(self, inner):
        super().__init__(inner)

    async def __call__(self, scope, receive, send):
        try:
            token = dict(
                (x.split("=") for x in scope["query_string"].decode().split("&"))
            ).get("token", None)
            validated_token = JWTTokenUserAuthentication().get_validated_token(
                raw_token=token
            )
            scope["user"] = await get_user(validated_token=validated_token)
        except (InvalidToken, ValueError):
            scope["user"] = AnonymousUser()
        return await super().__call__(scope, receive, send)


def JwtAuthMiddlewareStack(inner):
    return JwtAuthMiddleware(AuthMiddlewareStack(inner))
