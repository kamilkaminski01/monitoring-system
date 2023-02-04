from django.urls import path

from .views import (
    CreateTicTacToeRoomView,
    TicTacToePlayersView,
    TicTacToeRoomExist,
    TicTacToeView,
)

urlpatterns = [
    path("", CreateTicTacToeRoomView.as_view(), name="create_tictactoe_room"),
    path("<str:room_name>/", TicTacToeView.as_view(), name="tictactoe"),
    path(
        "check_room/<str:room_name>/",
        TicTacToeRoomExist.as_view(),
        name="check_tictactoe_room",
    ),
    path(
        "players/<str:room_name>/",
        TicTacToePlayersView.as_view(),
        name="get_tictactoe_players",
    ),
]
