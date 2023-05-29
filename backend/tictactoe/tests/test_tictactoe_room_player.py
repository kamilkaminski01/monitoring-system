from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from tictactoe.serializers import TicTacToePlayerSerializer
from tictactoe.tests.factories import TicTacToePlayerFactory, TicTacToeRoomFactory


class TestTicTacToePlayerAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.room = TicTacToeRoomFactory()
        self.player = TicTacToePlayerFactory(room=self.room)
        self.room.players.add(self.player)
        self.room.players_turn = self.player
        self.room.save()
        self.url = reverse(
            "tictactoe_room_player",
            kwargs={"room_name": self.room.room_name, "username": self.player.username},
        )

    def test_get_tictactoe_player_details(self):
        response = self.client.get(self.url)
        expected_data = TicTacToePlayerSerializer(instance=self.player).data
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, expected_data)

    def test_get_non_existing_tictactoe_player_details(self):
        non_existing_player_url = reverse(
            "tictactoe_room_player",
            kwargs={"room_name": self.room.room_name, "username": "NonExistingPlayer"},
        )
        response = self.client.get(non_existing_player_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_tictactoe_player_details(self):
        data = {"is_ready": True, "is_winner": True}
        response = self.client.patch(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.player.refresh_from_db()
        self.assertEqual(self.player.is_ready, data["is_ready"])
        self.assertEqual(self.player.is_winner, data["is_winner"])
        self.assertEqual(self.room.players_turn, self.player)
