from django.urls import path

from .views import (
    FifteenPuzzleAPIView,
    FifteenPuzzleCheckAPIView,
    FifteenPuzzleDetailsAPIView,
    FifteenPuzzleMonitoringAPIView,
)

urlpatterns = [
    path(
        "check/<str:username>/",
        FifteenPuzzleCheckAPIView.as_view(),
        name="check_existing_fifteen_puzzle",
    ),
    path("details/", FifteenPuzzleAPIView.as_view(), name="create_fifteen_puzzle"),
    path(
        "details/<str:username>/",
        FifteenPuzzleDetailsAPIView.as_view(),
        name="fifteen_puzzle_details",
    ),
    path(
        "monitoring/details/<str:username>/",
        FifteenPuzzleMonitoringAPIView.as_view(),
        name="monitoring_fifteen_puzzle",
    ),
]
