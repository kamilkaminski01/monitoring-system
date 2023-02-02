import re

from django.http import HttpRequest, HttpResponse, JsonResponse
from django.shortcuts import render
from django.views import View
from django.views.decorators.csrf import csrf_exempt

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
    @csrf_exempt
    def get(self, request: HttpRequest, room_name: str) -> JsonResponse:
        return JsonResponse(
            {"room_exist": BingoRoom.objects.filter(room_name=room_name).exists()}
        )
