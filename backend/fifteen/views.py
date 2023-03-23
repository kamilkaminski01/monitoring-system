from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveUpdateAPIView,
)
from rest_framework.request import Request
from rest_framework.response import Response

from .models import FifteenPuzzle
from .serializers import FifteenPuzzleDetailsSerializer, FifteenPuzzleSerializer


class FifteenPuzzleCheckAPIView(RetrieveAPIView):
    queryset = FifteenPuzzle.objects.all()
    lookup_field = "username"

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        try:
            self.get_object()
            return Response({"game_exist": True})
        except Http404:
            return Response({"game_exist": False})


class FifteenPuzzleAPIView(CreateAPIView):
    queryset = FifteenPuzzle.objects.all()
    serializer_class = FifteenPuzzleSerializer


class FifteenPuzzleDetailsAPIView(RetrieveUpdateAPIView):
    queryset = FifteenPuzzle.objects.all()
    serializer_class = FifteenPuzzleDetailsSerializer
    lookup_field = "username"

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            instance: FifteenPuzzle = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {
                    "message": "Fifteen puzzle does not exist",
                    "code": "fifteen_puzzle_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )
