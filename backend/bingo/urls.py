from django.urls import path

from .views import bingo_room_exist, bingo_view, create_bingo_room_view

urlpatterns = [
    path("", create_bingo_room_view, name="create_bingo_room"),
    path("<str:room_name>/", bingo_view, name="bingo"),
    path("room/check_room/<room_name>/", bingo_room_exist, name="check_bingo_room"),
]
