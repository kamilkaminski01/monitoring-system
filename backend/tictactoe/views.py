import re

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt

from .models import TicTacToeRoom


def create_room_view(request: HttpRequest) -> HttpResponse:
    return render(request, "tictactoe/home.html")


def tictactoe_view(request: HttpRequest, room_name: str) -> HttpResponse:
    if not re.match(r"^[\w-]*$", room_name):
        return render(request, "tictactoe/error.html")
    return render(request, "tictactoe/tictactoe.html")


@csrf_exempt
def room_exist(request: HttpRequest, room_name: str) -> JsonResponse:
    return JsonResponse(
        {"room_exist": TicTacToeRoom.objects.filter(room_name=room_name).exists()}
    )
