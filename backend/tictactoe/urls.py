from django.urls import path

from .views import home, play

urlpatterns = [
    path("", home, name="home"),
    path("play/<str:room>", play, name="play"),
]
