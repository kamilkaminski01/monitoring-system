from django.urls import path

from .views import (
    FifteenPuzzleAPIView,
    FifteenPuzzleCheckAPIView,
    FifteenPuzzleDetailsAPIView,
    FifteenPuzzleMonitoringAPIView,
)

urlpatterns = [
    path("check/<str:username>/", FifteenPuzzleCheckAPIView.as_view()),
    path("details/", FifteenPuzzleAPIView.as_view()),
    path("details/<str:username>/", FifteenPuzzleDetailsAPIView.as_view()),
    path(
        "monitoring/details/<str:username>/", FifteenPuzzleMonitoringAPIView.as_view()
    ),
]
