from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from tictactoe.models import TicTacToeRoom


class TestCreateTicTacToeRoomAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("create_tictactoe_room")

    def test_create_tictactoe_room(self):
        data = {
            "room_name": "room",
            "player": "kamil",
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        room = TicTacToeRoom.objects.filter(room_name="room").first()
        self.assertIsNotNone(room)
        self.assertEqual(room.players.count(), 1)
        self.assertTrue(room.game_state)
        self.assertEqual(room.players_turn, room.players.first())
