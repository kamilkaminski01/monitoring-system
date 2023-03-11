from django.urls import path

from .views import (
    TicTacToeAPIView,
    TicTacToeCheckAPIView,
    TicTacToeMonitoringAPIView,
    TicTacToePlayerAPIView,
    TicTacToeRoomDetailsAPIView,
)

urlpatterns = [
    path("check/<str:room_name>/", TicTacToeCheckAPIView.as_view()),
    path("details/", TicTacToeAPIView.as_view()),
    path("details/<str:room_name>/", TicTacToeRoomDetailsAPIView.as_view()),
    path("details/<str:room_name>/<str:username>/", TicTacToePlayerAPIView.as_view()),
    path("monitoring/details/<str:room_name>/", TicTacToeMonitoringAPIView.as_view()),
]
