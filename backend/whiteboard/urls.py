from django.urls import path

from .views import (
    WhiteboardAPIView,
    WhiteboardCheckAPIView,
    WhiteboardDetailsAPIView,
    WhiteboardMonitoringAPIView,
)

urlpatterns = [
    path(
        "check/<str:room_name>/",
        WhiteboardCheckAPIView.as_view(),
        name="check_existing_whiteboard",
    ),
    path("details/", WhiteboardAPIView.as_view(), name="create_whiteboard"),
    path(
        "details/<str:room_name>/",
        WhiteboardDetailsAPIView.as_view(),
        name="details_whiteboard",
    ),
    path(
        "monitoring/details/<str:room_name>/",
        WhiteboardMonitoringAPIView.as_view(),
        name="monitoring_whiteboard",
    ),
]
