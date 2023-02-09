from django.urls import path

from .views import BingoRoomDetails, BingoRoomExist, BingoView, CreateBingoRoomView

urlpatterns = [
    path("", CreateBingoRoomView.as_view(), name="create_bingo_room"),
    path("<str:room_name>/", BingoView.as_view(), name="bingo"),
    path(
        "check_room/<str:room_name>/",
        BingoRoomExist.as_view(),
        name="check_bingo_room",
    ),
    path(
        "details/<str:room_name>/",
        BingoRoomDetails.as_view(),
        name="details_bingo_room",
    ),
]
