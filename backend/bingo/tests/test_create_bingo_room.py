from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from bingo.models import BingoRoom


class TestCreateBingoRoomAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("create_bingo_room")

    def test_create_bingo_room(self):
        data = {
            "room_name": "room",
            "player": "kamil",
            "players_limit": 4,
        }
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        room = BingoRoom.objects.filter(room_name="room").first()
        self.assertIsNotNone(room)
        self.assertEqual(room.players.count(), 1)
        self.assertEqual(room.players_limit, 4)
        self.assertTrue(room.game_state)
        self.assertEqual(room.players_turn, room.players.first())
