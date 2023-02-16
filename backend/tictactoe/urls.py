from django.urls import path

from .views import (
    CreateTicTacToeRoomView,
    TicTacToeRoomDetails,
    TicTacToeRoomExist,
    TicTacToeView,
)

urlpatterns = [
    path("", CreateTicTacToeRoomView.as_view(), name="create_tictactoe_room"),
    path("<str:room_name>/", TicTacToeView.as_view(), name="tictactoe"),
    path(
        "api/check/<str:room_name>/",
        TicTacToeRoomExist.as_view(),
        name="check_tictactoe_room",
    ),
    path(
        "api/details/<str:room_name>/",
        TicTacToeRoomDetails.as_view(),
        name="details_tictactoe_room",
    ),
]
