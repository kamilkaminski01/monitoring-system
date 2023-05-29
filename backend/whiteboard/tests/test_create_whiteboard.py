from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from whiteboard.models import Whiteboard


class TestCreateWhiteboardAPI(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.url = reverse("create_whiteboard")

    def test_create_whiteboard(self):
        data = {
            "room_name": "whiteboard",
            "player": "kamil",
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        whiteboard = Whiteboard.objects.filter(room_name="whiteboard").first()
        self.assertIsNotNone(whiteboard)
        self.assertEqual(whiteboard.players.count(), 1)
