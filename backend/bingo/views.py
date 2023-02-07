import re

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from .models import BingoPlayer, BingoRoom


class CreateBingoRoomView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "bingo/home.html")


class BingoView(View):
    def get(self, request: HttpRequest, room_name: str) -> HttpResponse:
        if not re.match(r"^[\w-]*$", room_name):
            return render(request, "bingo/error.html")
        return render(request, "bingo/bingo.html")


class BingoRoomExist(View):
    @csrf_exempt
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        return JsonResponse(
            {"room_exist": BingoRoom.objects.filter(room_name=room_name).exists()}
        )


class BingoPlayersView(View):
    @csrf_exempt
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        bingo_room = BingoRoom.objects.get(room_name=room_name)
        players = BingoPlayer.objects.filter(room=bingo_room)
        player_data = []
        for player in players:
            player_data.append(
                {
                    "username": player.username,
                    "initial_board_state": player.initial_board_state,
                    "bingo_state": player.bingo_state,
                }
            )
        return JsonResponse(
            {"players": player_data, "board_state": bingo_room.board_state}
        )
