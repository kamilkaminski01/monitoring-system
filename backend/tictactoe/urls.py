from django.urls import path

from .views import create_tictactoe_room_view, tictactoe_room_exist, tictactoe_view

urlpatterns = [
    path("", create_tictactoe_room_view, name="create_tictactoe_room"),
    path("<str:room_name>/", tictactoe_view, name="tictactoe"),
    path(
        "room/check_room/<room_name>/",
        tictactoe_room_exist,
        name="check_tictactoe_room",
    ),
]
