import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from tictactoe.models import TicTacToeRoom
from tictactoe.tests.factories import TicTacToePlayerFactory, TicTacToeRoomFactory
from users.models import User


class TestMonitoringTicTacToeRoom(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.tictactoe_room = TicTacToeRoomFactory()
        self.player1 = TicTacToePlayerFactory(
            room=self.tictactoe_room, username="player1", figure="O"
        )
        self.player2 = TicTacToePlayerFactory(
            room=self.tictactoe_room, username="player2", figure="X"
        )
        self.tictactoe_room.players.add(self.player1, self.player2)
        self.tictactoe_room.players_turn = self.player1
        self.tictactoe_room.save()
        self.admin = User.objects.create_user(
            email="admin@admin.com", password="Admin-123"
        )
        self.url = reverse(
            "monitoring_tictactoe_room",
            kwargs={"room_name": self.tictactoe_room.room_name},
        )
        refresh = RefreshToken.for_user(self.admin)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}

    def test_get_tictactoe_room_details(self):
        response = self.client.get(self.url, **self.auth_headers)
        player1_data = response.data["players"][0]
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_name"], self.tictactoe_room.room_name)
        self.assertEqual(len(response.data["players"]), 2)
        self.assertEqual(player1_data["username"], self.player1.username)

    def test_get_non_existing_tictactoe_room_details(self):
        non_existing_room_url = reverse(
            "monitoring_tictactoe_room", kwargs={"room_name": "NonExistingRoom"}
        )
        response = self.client.get(non_existing_room_url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_tictactoe_room_not_authenticated(self):
        response = self.client.get(self.url)
        response_data = json.loads(response.content)
        self.assertEqual(status.HTTP_401_UNAUTHORIZED, response.status_code)
        self.assertEqual(response_data.get("code"), "not_authenticated")

    def test_delete_tictactoe_room(self):
        response = self.client.delete(self.url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            TicTacToeRoom.objects.filter(id=self.tictactoe_room.id).exists()
        )
