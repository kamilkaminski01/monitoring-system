import re

from django.http import Http404, HttpRequest, HttpResponse
from django.shortcuts import render
from django.views import View
from rest_framework import status
from rest_framework.generics import CreateAPIView, RetrieveAPIView
from rest_framework.request import Request
from rest_framework.response import Response

from .models import BingoRoom
from .serializers import BingoRoomDetailsSerializer, BingoSerializer


class CreateBingoRoomView(View):
    def get(self, request: HttpRequest) -> HttpResponse:
        return render(request, "bingo/home.html")


class BingoView(View):
    def get(self, request: HttpRequest, room_name: str) -> HttpResponse:
        if not re.match(r"^[\w-]*$", room_name):
            return render(request, "bingo/error.html")
        response = BingoRoomCheckAPIView.as_view()(request, room_name=room_name)
        if not response.data["room_exist"]:
            return render(request, "bingo/error.html")
        return render(request, "bingo/bingo.html")


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


class BingoRoomDetailsAPIView(RetrieveAPIView):
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
