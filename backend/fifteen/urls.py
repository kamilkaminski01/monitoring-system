from django.urls import path

from .views import FifteenPuzzleAPIView, FifteenPuzzleDetailsAPIView

urlpatterns = [
    path("details/", FifteenPuzzleAPIView.as_view()),
    path("details/<str:username>/", FifteenPuzzleDetailsAPIView.as_view()),
]
