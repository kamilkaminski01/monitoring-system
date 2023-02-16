import re

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View

from .models import TicTacToeRoom


class CreateTicTacToeRoomView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "tictactoe/home.html")


class TicTacToeView(View):
    def get(self, request: HttpRequest, room_name: str) -> HttpResponse:
        if not re.match(r"^[\w-]*$", room_name):
            return render(request, "tictactoe/error.html")
        return render(request, "tictactoe/tictactoe.html")


class TicTacToeRoomExist(View):
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        return JsonResponse(
            {"room_exist": TicTacToeRoom.objects.filter(room_name=room_name).exists()}
        )


class TicTacToeRoomDetails(View):
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        try:
            tictactoe_room = TicTacToeRoom.objects.get(room_name=room_name)
            players = tictactoe_room.players.all()
            player_list = [
                {"username": player.username, "is_active": player.is_active}
                for player in players
            ]
            if players_turn := tictactoe_room.players_turn:
                players_turn_data = players_turn.username
            else:
                players_turn_data = None
            return JsonResponse(
                {
                    "players": player_list,
                    "players_turn": players_turn_data,
                }
            )
        except TicTacToeRoom.DoesNotExist:
            return JsonResponse({"error": "TicTacToeRoom does not exist."}, status=404)
