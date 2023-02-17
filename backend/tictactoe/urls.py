from django.urls import path

from .views import (
    CreateTicTacToeRoomView,
    TicTacToeAPIView,
    TicTacToeCheckAPIView,
    TicTacToeRoomDetailsView,
    TicTacToeView,
)

urlpatterns = [
    path("", CreateTicTacToeRoomView.as_view(), name="create_tictactoe_room"),
    path("<str:room_name>/", TicTacToeView.as_view(), name="tictactoe"),
    path(
        "api/check/<str:room_name>/",
        TicTacToeCheckAPIView.as_view(),
        name="check_tictactoe_room",
    ),
    path("api/details/", TicTacToeAPIView.as_view(), name="tictactoe_api"),
    path(
        "api/details/<str:room_name>/",
        TicTacToeRoomDetailsView.as_view(),
        name="details_tictactoe_room",
    ),
]
