from django.urls import path

from .views import (
    TicTacToeAPIView,
    TicTacToeCheckAPIView,
    TicTacToeMonitoringAPIView,
    TicTacToePlayerAPIView,
    TicTacToeRoomDetailsAPIView,
)

urlpatterns = [
    path(
        "check/<str:room_name>/",
        TicTacToeCheckAPIView.as_view(),
        name="check_existing_tictactoe_room",
    ),
    path("details/", TicTacToeAPIView.as_view(), name="create_tictactoe_room"),
    path(
        "details/<str:room_name>/",
        TicTacToeRoomDetailsAPIView.as_view(),
        name="details_tictactoe_room",
    ),
    path(
        "details/<str:room_name>/<str:username>/",
        TicTacToePlayerAPIView.as_view(),
        name="tictactoe_room_player",
    ),
    path(
        "monitoring/details/<str:room_name>/",
        TicTacToeMonitoringAPIView.as_view(),
        name="monitoring_tictactoe_room",
    ),
]
