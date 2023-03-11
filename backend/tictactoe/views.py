from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.serializers import ModelSerializer

from .models import TicTacToePlayer, TicTacToeRoom
from .serializers import (
    TicTacToePlayerSerializer,
    TicTacToeRoomDetailsSerializer,
    TicTacToeSerializer,
)


class TicTacToeCheckAPIView(RetrieveAPIView):
    queryset = TicTacToeRoom.objects.all()
    lookup_field = "room_name"

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        try:
            self.get_object()
            return Response({"room_exist": True})
        except Http404:
            return Response({"room_exist": False})


class TicTacToeAPIView(CreateAPIView):
    queryset = TicTacToeRoom.objects.all()
    serializer_class = TicTacToeSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer: TicTacToeSerializer) -> None:
        room_name = self.request.data.get("room_name")
        username = self.request.data.get("player")
        tictactoe_room, created = TicTacToeRoom.objects.get_or_create(
            room_name=room_name
        )
        if created:
            tictactoe_room.game_state = True
            figure = "O"
        else:
            figure = "X"
        player = TicTacToePlayer.objects.create(
            username=username, room=tictactoe_room, is_active=True, figure=figure
        )
        tictactoe_room.players.add(player)
        if not tictactoe_room.players_turn:
            tictactoe_room.players_turn = player
        tictactoe_room.save()


class TicTacToeRoomDetailsAPIView(RetrieveUpdateAPIView):
    serializer_class = TicTacToeRoomDetailsSerializer
    queryset = TicTacToeRoom.objects.all()
    lookup_field = "room_name"

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            instance: TicTacToeRoom = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {
                    "message": "Tic tac toe room does not exist",
                    "code": "tictactoe_room_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )

    def perform_update(self, serializer: TicTacToeRoomDetailsSerializer) -> None:
        instance = serializer.instance
        players: list = list(instance.players.all().order_by("id"))
        current_player = instance.players_turn
        next_turn_player = None
        for player in players:
            if player != current_player:
                next_turn_player = player
                break
        instance.players_turn = next_turn_player
        if any(cell == "" for cell in instance.board_state):
            instance.game_state = False
        serializer.save()

    def get_serializer_class(self) -> ModelSerializer:
        if self.request.method == "GET":
            return TicTacToeRoomDetailsSerializer
        return super().get_serializer_class()


class TicTacToePlayerAPIView(RetrieveUpdateAPIView):
    serializer_class = TicTacToePlayerSerializer
    queryset = TicTacToePlayer.objects.all()
    lookup_field = "username"

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            instance: TicTacToePlayer = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {
                    "message": "Tic tac toe player in room does not exist",
                    "code": "tictactoe_player_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )


class TicTacToeMonitoringAPIView(RetrieveAPIView):
    serializer_class = TicTacToeRoomDetailsSerializer
    queryset = TicTacToeRoom.objects.all()
    lookup_field = "room_name"
    permission_classes = [IsAuthenticated]
