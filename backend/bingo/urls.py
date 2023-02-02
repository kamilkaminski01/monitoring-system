from django.urls import path

from .views import BingoRoomExist, BingoView, CreateBingoRoomView

urlpatterns = [
    path("", CreateBingoRoomView.as_view(), name="create_bingo_room"),
    path("<str:room_name>/", BingoView.as_view(), name="bingo"),
    path(
        "room/check_room/<str:room_name>/",
        BingoRoomExist.as_view(),
        name="check_bingo_room",
    ),
]
