import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from users.models import User
from whiteboard.models import Whiteboard
from whiteboard.serializers import WhiteboardRoomDetailsSerializer
from whiteboard.tests.factories import WhiteboardFactory


class TestMonitoringWhiteboard(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.whiteboard = WhiteboardFactory()
        self.admin = User.objects.create_user(  # type: ignore
            email="admin@admin.com", password="Admin-123"
        )
        self.url = reverse(
            "monitoring_whiteboard", kwargs={"room_name": self.whiteboard.room_name}
        )
        refresh = RefreshToken.for_user(self.admin)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}

    def test_retrieve_whiteboard_details(self):
        response = self.client.get(self.url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_name"], self.whiteboard.room_name)
        serializer = WhiteboardRoomDetailsSerializer(instance=self.whiteboard)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_nonexistent_whiteboard(self):
        nonexistent_url = reverse(
            "monitoring_whiteboard", kwargs={"room_name": "nonexistent"}
        )
        response = self.client.get(nonexistent_url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_delete_whiteboard(self):
        response = self.client.delete(self.url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            Whiteboard.objects.filter(room_name=self.whiteboard.room_name).exists()
        )

    def test_retrieve_whiteboard_not_authenticated(self):
        response = self.client.get(self.url)
        response_data = json.loads(response.content)
        self.assertEqual(401, response.status_code)
        self.assertEqual(response_data.get("code"), "not_authenticated")
