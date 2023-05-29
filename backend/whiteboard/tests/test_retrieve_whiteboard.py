from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from whiteboard.serializers import WhiteboardRoomDetailsSerializer
from whiteboard.tests.factories import WhiteboardFactory


class TestRetrieveWhiteboard(TestCase):
    def setUp(self) -> None:
        self.client = APIClient()
        self.whiteboard = WhiteboardFactory()
        self.url = reverse(
            "details_whiteboard", kwargs={"room_name": self.whiteboard.room_name}
        )

    def test_retrieve_whiteboard_details(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_name"], self.whiteboard.room_name)
        serializer = WhiteboardRoomDetailsSerializer(instance=self.whiteboard)
        self.assertEqual(response.data, serializer.data)

    def test_retrieve_nonexistent_whiteboard(self):
        nonexistent_url = reverse(
            "details_whiteboard", kwargs={"room_name": "nonexistent"}
        )
        response = self.client.get(nonexistent_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(response.data["code"], "whiteboard_not_found")
