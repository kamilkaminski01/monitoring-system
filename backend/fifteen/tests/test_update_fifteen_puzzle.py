import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from fifteen.tests.factories import FifteenPuzzleFactory


class TestFifteenPuzzleDetailsAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.fifteen_puzzle = FifteenPuzzleFactory()
        self.url = reverse(
            "fifteen_puzzle_details", kwargs={"username": self.fifteen_puzzle.username}
        )

    def test_get_fifteen_puzzle_details(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["board_state"], self.fifteen_puzzle.board_state)
        self.assertEqual(response.data["game_state"], self.fifteen_puzzle.game_state)
        self.assertEqual(response.data["moves"], self.fifteen_puzzle.moves)

    def test_get_non_existing_fifteen_puzzle_details(self):
        non_existing_puzzle_url = reverse(
            "fifteen_puzzle_details", kwargs={"username": "NonExistingUser"}
        )
        response = self.client.get(non_existing_puzzle_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_update_fifteen_puzzle_details(self):
        data = {
            "board_state": json.dumps(
                [
                    [None, 4, 15, 2],
                    [14, 7, 8, 6],
                    [9, 11, 13, 12],
                    [5, 3, 10, 1],
                ]
            ),
            "moves": 3,
            "game_state": True,
        }
        response = self.client.put(self.url, data=data)
        self.fifteen_puzzle.refresh_from_db()
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(
            self.fifteen_puzzle.board_state, json.loads(data["board_state"])
        )
        self.assertEqual(self.fifteen_puzzle.moves, data["moves"])
        self.assertEqual(self.fifteen_puzzle.game_state, data["game_state"])
