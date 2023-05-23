from django.urls import path

from .views import (
    BingoAPIView,
    BingoMonitoringAPIView,
    BingoPlayerAPIView,
    BingoRoomCheckAPIView,
    BingoRoomDetailsAPIView,
)

urlpatterns = [
    path(
        "check/<str:room_name>/",
        BingoRoomCheckAPIView.as_view(),
        name="check_existing_bingo_room",
    ),
    path("details/", BingoAPIView.as_view(), name="create_bingo_room"),
    path(
        "details/<str:room_name>/",
        BingoRoomDetailsAPIView.as_view(),
        name="details_bingo_room",
    ),
    path(
        "details/<str:room_name>/<str:username>/",
        BingoPlayerAPIView.as_view(),
        name="bingo_room_player",
    ),
    path(
        "monitoring/details/<str:room_name>/",
        BingoMonitoringAPIView.as_view(),
        name="monitoring_bingo_room",
    ),
]
