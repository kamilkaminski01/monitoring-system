import json

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APITestCase

from tictactoe.models import TicTacToeRoom
from tictactoe.tests.factories import TicTacToePlayerFactory, TicTacToeRoomFactory


class TicTacToeRoomDetailsAPITest(APITestCase):
    def setUp(self):
        self.client = APIClient()
        self.room = TicTacToeRoomFactory()
        self.player1 = TicTacToePlayerFactory(
            room=self.room, username="player1", figure="O"
        )
        self.player2 = TicTacToePlayerFactory(
            room=self.room, username="player2", figure="X"
        )
        self.room.players.add(self.player1, self.player2)
        self.room.players_turn = self.player1
        self.room.save()
        self.url = reverse(
            "details_tictactoe_room", kwargs={"room_name": self.room.room_name}
        )

    def test_retrieve_tictactoe_room_details(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_name"], self.room.room_name)

    def test_get_non_existing_tictactoe_room_details(self):
        non_existing_room_url = reverse(
            "details_tictactoe_room", kwargs={"room_name": "NonExistingRoom"}
        )
        response = self.client.get(non_existing_room_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_tictactoe_room_details(self):
        data = {
            "game_state": True,
            "board_state": json.dumps(["X", "", "", "O", "X", "", "", "", "O"]),
        }
        response = self.client.patch(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        updated_tictactoe_room = TicTacToeRoom.objects.get(id=self.room.id)
        self.assertEqual(updated_tictactoe_room.game_state, True)
