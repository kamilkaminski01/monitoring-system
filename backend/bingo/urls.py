from django.urls import path

from .views import (
    BingoAPIView,
    BingoPlayerAPIView,
    BingoRoomCheckAPIView,
    BingoRoomDetailsAPIView,
)

urlpatterns = [
    path("check/<str:room_name>/", BingoRoomCheckAPIView.as_view()),
    path("details/", BingoAPIView.as_view()),
    path("details/<str:room_name>/", BingoRoomDetailsAPIView.as_view()),
    path("details/<str:room_name>/<str:username>/", BingoPlayerAPIView.as_view()),
]
