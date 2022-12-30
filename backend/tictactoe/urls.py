from django.urls import path

from .views import create_room_view, room_exist, tictactoe_view

urlpatterns = [
    path("", create_room_view, name="create_room"),
    path("<str:room_name>/", tictactoe_view, name="tictactoe"),
    path("room/check_room/<room_name>/", room_exist, name="check_room"),
]
