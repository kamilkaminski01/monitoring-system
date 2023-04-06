from django.urls import path

from .views import (
    WhiteboardAPIView,
    WhiteboardCheckAPIView,
    WhiteboardDetailsAPIView,
    WhiteboardMonitoringAPIView,
)

urlpatterns = [
    path("check/<str:room_name>/", WhiteboardCheckAPIView.as_view()),
    path("details/", WhiteboardAPIView.as_view()),
    path("details/<str:room_name>/", WhiteboardDetailsAPIView.as_view()),
    path("monitoring/details/<str:room_name>/", WhiteboardMonitoringAPIView.as_view()),
]
