import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from bingo.models import BingoRoom
from bingo.tests.factories import BingoPlayerFactory, BingoRoomFactory
from users.models import User


class TestMonitoringBingoRoom(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.bingo_room = BingoRoomFactory()
        self.bingo_player1 = BingoPlayerFactory(
            room=self.bingo_room, username="player1"
        )
        self.bingo_player2 = BingoPlayerFactory(
            room=self.bingo_room, username="player2"
        )
        self.bingo_room.players.add(self.bingo_player1, self.bingo_player2)
        self.bingo_room.save()
        self.admin = User.objects.create_user(
            email="admin@admin.com", password="Admin-123"
        )
        self.url = reverse(
            "monitoring_bingo_room", kwargs={"room_name": self.bingo_room.room_name}
        )
        refresh = RefreshToken.for_user(self.admin)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}

    def test_get_bingo_room_details(self):
        response = self.client.get(self.url, **self.auth_headers)
        player1_data = response.data["players"][0]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_name"], self.bingo_room.room_name)
        self.assertEqual(len(response.data["players"]), 2)
        self.assertEqual(player1_data["username"], self.bingo_player1.username)

    def test_delete_bingo_room(self):
        response = self.client.delete(self.url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(BingoRoom.objects.filter(id=self.bingo_room.id).exists())

    def test_delete_non_existing_bingo_room(self):
        non_existing_room_url = reverse(
            "monitoring_bingo_room", kwargs={"room_name": "no-room"}
        )
        response = self.client.delete(non_existing_room_url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_bingo_room_not_authenticated(self):
        response = self.client.get(self.url)
        response_data = json.loads(response.content)
        self.assertEqual(401, response.status_code)
        self.assertEqual(response_data.get("code"), "not_authenticated")
