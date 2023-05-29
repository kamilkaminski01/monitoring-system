from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from whiteboard.tests.factories import WhiteboardFactory


class TestCheckWhiteboardAPI(TestCase):
    def setUp(self) -> None:
        self.whiteboard = WhiteboardFactory()

    def test_existing_room(self):
        url = reverse(
            "check_existing_whiteboard", kwargs={"room_name": self.whiteboard.room_name}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_exist"], True)

    def test_non_existing_room(self):
        url = reverse("check_existing_whiteboard", kwargs={"room_name": "no-room"})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_exist"], False)
