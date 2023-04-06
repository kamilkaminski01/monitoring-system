from django.http import Http404
from rest_framework import status
from rest_framework.generics import (
    CreateAPIView,
    RetrieveAPIView,
    RetrieveDestroyAPIView,
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response

from .models import Whiteboard, WhiteboardPlayer
from .serializers import WhiteboardRoomDetailsSerializer, WhiteboardSerializer


class WhiteboardCheckAPIView(RetrieveAPIView):
    queryset = Whiteboard.objects.all()
    lookup_field = "room_name"

    def retrieve(self, request: Request, *args, **kwargs) -> Response:
        try:
            self.get_object()
            return Response({"room_exist": True})
        except Http404:
            return Response({"room_exist": False})


class WhiteboardAPIView(CreateAPIView):
    queryset = Whiteboard.objects.all()
    serializer_class = WhiteboardSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        return self.create(request, *args, **kwargs)

    def perform_create(self, serializer: WhiteboardSerializer) -> None:
        whiteboard_room = self.request.data.get("room_name")
        username = self.request.data.get("player")
        whiteboard_room, created = Whiteboard.objects.get_or_create(
            room_name=whiteboard_room
        )
        player = WhiteboardPlayer.objects.create(
            username=username, room=whiteboard_room, is_active=True
        )
        whiteboard_room.players.add(player)
        whiteboard_room.save()


class WhiteboardDetailsAPIView(RetrieveAPIView):
    serializer_class = WhiteboardRoomDetailsSerializer
    queryset = Whiteboard.objects.all()
    lookup_field = "room_name"

    def get(self, request: Request, *args, **kwargs) -> Response:
        try:
            instance: Whiteboard = self.get_object()
            serializer = self.get_serializer(instance)
            return Response(serializer.data)
        except Http404:
            return Response(
                {
                    "message": "Whiteboard does not exist",
                    "code": "whiteboard_not_found",
                },
                status=status.HTTP_404_NOT_FOUND,
            )


class WhiteboardMonitoringAPIView(RetrieveDestroyAPIView):
    serializer_class = WhiteboardRoomDetailsSerializer
    queryset = Whiteboard.objects.all()
    lookup_field = "room_name"
    permission_classes = [IsAuthenticated]
