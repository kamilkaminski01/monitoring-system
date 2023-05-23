from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from bingo.models import BingoPlayer
from bingo.serializers import BingoPlayerSerializer
from bingo.tests.factories import BingoPlayerFactory, BingoRoomFactory


class TestBingoPlayerAPI(TestCase):
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
        self.bingo_room.players_turn = self.bingo_player1
        self.bingo_room.players_queue = [
            self.bingo_player1.username,
            self.bingo_player2.username,
        ]
        self.bingo_room.save()
        self.url = reverse(
            "bingo_room_player",
            kwargs={
                "room_name": self.bingo_room.room_name,
                "username": self.bingo_player1.username,
            },
        )
        self.room_details_url = reverse(
            "details_bingo_room", kwargs={"room_name": self.bingo_room.room_name}
        )

    def test_get_bingo_player_details(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = BingoPlayerSerializer(self.bingo_player1).data
        self.assertEqual(response.data, expected_data)

    def test_get_non_existing_bingo_player_details(self):
        non_existing_player_url = reverse(
            "bingo_room_player",
            kwargs={"room_name": self.bingo_room.room_name, "username": "no_player"},
        )
        response = self.client.get(non_existing_player_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_bingo_player_details(self):
        data = {"is_ready": True}
        response = self.client.patch(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_bingo_player = BingoPlayer.objects.get(id=self.bingo_player1.id)
        self.assertEqual(updated_bingo_player.is_ready, True)

    def test_bingo_room_players_turn(self):
        data = {"board_state": [1]}
        patch_response = self.client.patch(self.room_details_url, data=data)
        get_response = self.client.get(self.room_details_url)
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)
        self.assertEqual(get_response.data["players_turn"], self.bingo_player2.username)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
