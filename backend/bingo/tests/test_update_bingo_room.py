from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from bingo.models import BingoRoom
from bingo.tests.factories import BingoPlayerFactory, BingoRoomFactory


class TestBingoRoomDetailsAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.bingo_room = BingoRoomFactory()
        self.bingo_player1 = BingoPlayerFactory(
            room=self.bingo_room,
            username="mateusz",
        )
        self.bingo_player2 = BingoPlayerFactory(
            room=self.bingo_room,
            username="kamil",
        )
        self.bingo_room.players.add(self.bingo_player1, self.bingo_player2)
        self.bingo_room.players_turn = self.bingo_player1
        self.bingo_room.players_queue = [
            self.bingo_player1.username,
            self.bingo_player2.username,
        ]
        self.bingo_room.save()
        self.url = reverse(
            "details_bingo_room", kwargs={"room_name": self.bingo_room.room_name}
        )

    def test_get_bingo_room_details(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_name"], self.bingo_room.room_name)

    def test_get_non_existing_bingo_room_details(self):
        non_existing_room_url = reverse(
            "details_bingo_room", kwargs={"room_name": "NonExistingRoom"}
        )
        response = self.client.get(non_existing_room_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_bingo_room_details(self):
        data = {"game_state": False}
        response = self.client.patch(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_bingo_room = BingoRoom.objects.get(id=self.bingo_room.id)
        self.assertEqual(updated_bingo_room.game_state, False)
