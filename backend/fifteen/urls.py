from django.urls import path

from .views import (
    FifteenPuzzleAPIView,
    FifteenPuzzleCheckAPIView,
    FifteenPuzzleDetailsAPIView,
)

urlpatterns = [
    path("check/<str:username>/", FifteenPuzzleCheckAPIView.as_view()),
    path("details/", FifteenPuzzleAPIView.as_view()),
    path("details/<str:username>/", FifteenPuzzleDetailsAPIView.as_view()),
]
