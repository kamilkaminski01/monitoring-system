from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
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
        players_queue = instance.players_queue
        current_player = BingoPlayer.objects.get(username=instance.players_turn)
        current_player_index = players_queue.index(current_player.username)
        next_player_index = (current_player_index + 1) % len(players_queue)
        next_player = players_queue[next_player_index]
        instance.players_turn = BingoPlayer.objects.get(username=next_player)
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

    def perform_update(self, serializer: BingoPlayerSerializer) -> None:
        if "is_ready" in self.request.data:
            instance = serializer.instance
            room = instance.room
            if room.players_limit == len(room.players_queue):
                room.players_queue = []
            if not room.players_queue:
                room.players_queue = [instance.username]
                room.players_turn = instance
                updated_fields = ["players_queue", "players_turn"]
            else:
                room.players_queue.append(instance.username)
                updated_fields = ["players_queue"]
            room.save(update_fields=updated_fields)
        serializer.save()


class BingoMonitoringAPIView(RetrieveDestroyAPIView):
    serializer_class = BingoRoomDetailsSerializer
    queryset = BingoRoom.objects.all()
    lookup_field = "room_name"
    permission_classes = [IsAuthenticated]
