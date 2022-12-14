from django.urls import path

from .views import bingo_view, create_room_view, room_exist

urlpatterns = [
    path("", create_room_view, name="create_room"),
    path("<str:room_name>/", bingo_view, name="bingo"),
    path("room/check_room/<room_name>/", room_exist, name="check_room"),
]
