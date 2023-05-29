from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from tictactoe.tests.factories import TicTacToeRoomFactory


class TestCheckTicTacToeRoomAPI(TestCase):
    def setUp(self) -> None:
        self.room = TicTacToeRoomFactory()

    def test_existing_room(self):
        url = reverse(
            "check_existing_tictactoe_room", kwargs={"room_name": self.room.room_name}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_exist"], True)

    def test_non_existing_room(self):
        url = reverse(
            "check_existing_tictactoe_room", kwargs={"room_name": "NonExistingRoom"}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["room_exist"], False)
