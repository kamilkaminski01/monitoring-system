from django.urls import path

from .views import (
    BingoRoomCheckAPIView,
    BingoRoomDetailsAPIView,
    BingoView,
    CreateBingoRoomView,
)

urlpatterns = [
    path("", CreateBingoRoomView.as_view(), name="create_bingo_room"),
    path("<str:room_name>/", BingoView.as_view(), name="bingo"),
    path(
        "api/check/<str:room_name>/",
        BingoRoomCheckAPIView.as_view(),
        name="check_bingo_room",
    ),
    path(
        "api/details/<str:room_name>/",
        BingoRoomDetailsAPIView.as_view(),
        name="details_bingo_room",
    ),
]
