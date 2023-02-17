import re

from django.http import Http404, HttpRequest, HttpResponse
from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from .models import TicTacToeRoom
from .serializers import TicTacToeRoomDetailsSerializer, TicTacToeSerializer


class CreateTicTacToeRoomView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "tictactoe/home.html")


class TicTacToeView(View):
    def get(self, request: HttpRequest, room_name: str) -> HttpResponse:
        if not re.match(r"^[\w-]*$", room_name):
            return render(request, "tictactoe/error.html")
        response = TicTacToeCheckAPIView.as_view()(request, room_name=room_name)
        if not response.data["room_exist"]:
            return render(request, "tictactoe/error.html")
        return render(request, "tictactoe/tictactoe.html")


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


class TicTacToeRoomDetailsView(RetrieveAPIView):
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
