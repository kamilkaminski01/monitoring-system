import re

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt

from .models import TicTacToePlayer, TicTacToeRoom


class CreateTicTacToeRoomView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "tictactoe/home.html")


class TicTacToeView(View):
    def get(self, request: HttpRequest, room_name: str) -> HttpResponse:
        if not re.match(r"^[\w-]*$", room_name):
            return render(request, "tictactoe/error.html")
        return render(request, "tictactoe/tictactoe.html")


class TicTacToeRoomExist(View):
    @csrf_exempt
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        return JsonResponse(
            {"room_exist": TicTacToeRoom.objects.filter(room_name=room_name).exists()}
        )


class TicTacToeRoomDetails(View):
    @csrf_exempt
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        try:
            tictactoe_room = TicTacToeRoom.objects.get(room_name=room_name)
            users = TicTacToePlayer.objects.filter(room=tictactoe_room)
            users_list = [user.username for user in users]
            players = tictactoe_room.players.all()
            player_list = [
                {"username": player.username, "is_active": player.is_active}
                for player in players
            ]
            if players_turn := tictactoe_room.players_turn:
                players_turn_data = {
                    "username": players_turn.username,
                    "is_active": players_turn.is_active,
                }
            else:
                players_turn_data = None
            return JsonResponse(
                {
                    "users": users_list,
                    "players": player_list,
                    "players_turn": players_turn_data,
                }
            )
        except TicTacToeRoom.DoesNotExist:
            return JsonResponse({"error": "TicTacToeRoom does not exist."}, status=404)
