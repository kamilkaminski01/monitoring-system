from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from .models import BingoPlayer, BingoRoom
from .serializers import (
    BingoPlayerSerializer,
    BingoRoomDetailsSerializer,
    BingoSerializer,
)


class BingoRoomCheckAPIView(RetrieveAPIView):
    queryset = BingoRoom.objects.all()
    lookup_field = "room_name"

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        try:
            self.get_object()
            return Response({"room_exist": True})
        except Http404:
            return Response({"room_exist": False})


class BingoAPIView(CreateAPIView):
    queryset = BingoRoom.objects.all()
    serializer_class = BingoSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer: BingoSerializer) -> None:
        room_name = self.request.data.get("room_name")
        username = self.request.data.get("player")
        players_limit = self.request.data.get("players_limit")
        bingo_room, created = BingoRoom.objects.get_or_create(room_name=room_name)
        if created and players_limit:
            bingo_room.players_limit = players_limit
            bingo_room.game_state = True
        player = BingoPlayer.objects.create(
            username=username,
            room=bingo_room,
            is_active=True,
        )
        bingo_room.players.add(player)
        if not bingo_room.players_turn:
            bingo_room.players_turn = player
        bingo_room.save()


class BingoRoomDetailsAPIView(RetrieveUpdateAPIView):
    serializer_class = BingoRoomDetailsSerializer
    queryset = BingoRoom.objects.all()
    lookup_field = "room_name"

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            instance: BingoRoom = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {
                    "message": "Bingo room does not exist",
                    "code": "bingo_room_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    def perform_update(self, serializer: BingoRoomDetailsSerializer) -> None:
        instance = serializer.instance
        players: list = list(instance.players.all().order_by("id"))
        next_turn_player_index = (players.index(instance.players_turn) + 1) % len(
            players
        )
        next_turn_player = players[next_turn_player_index]
        instance.players_turn = next_turn_player
        serializer.save()

    def get_serializer_class(self) -> ModelSerializer:
        if self.request.method == "GET":
            return BingoRoomDetailsSerializer
        return super().get_serializer_class()


class BingoPlayerAPIView(RetrieveUpdateAPIView):
    serializer_class = BingoPlayerSerializer
    queryset = BingoPlayer.objects.all()
    lookup_field = "username"

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            instance: BingoPlayer = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {
                    "message": "Bingo player in room does not exist",
                    "code": "bingo_player_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
