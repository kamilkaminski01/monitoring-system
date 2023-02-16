import re

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View

from .models import BingoRoom


class CreateBingoRoomView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "bingo/home.html")


class BingoView(View):
    def get(self, request: HttpRequest, room_name: str) -> HttpResponse:
        if not re.match(r"^[\w-]*$", room_name):
            return render(request, "bingo/error.html")
        return render(request, "bingo/bingo.html")


class BingoRoomExist(View):
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        return JsonResponse(
            {"room_exist": BingoRoom.objects.filter(room_name=room_name).exists()}
        )


class BingoRoomDetails(View):
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        try:
            bingo_room = BingoRoom.objects.get(room_name=room_name)
            players = bingo_room.players.all()
            players_data = []
            for player in players:
                players_data.append(
                    {
                        "username": player.username,
                        "is_active": player.is_active,
                        "initial_board_state": player.initial_board_state,
                        "bingo_state": player.bingo_state,
                    }
                )
            if players_turn := bingo_room.players_turn:
                players_turn_data = players_turn.username
            else:
                players_turn_data = None
            room_data = {
                "board_state": bingo_room.board_state,
                "players_limit": bingo_room.players_limit,
            }
            return JsonResponse(
                {
                    "players": players_data,
                    "players_turn": players_turn_data,
                    "room": room_data,
                }
            )
        except BingoRoom.DoesNotExist:
            return JsonResponse({"error": "BingoRoom does not exist."}, status=404)
