from django.test import TestCase
from django.urls import reverse
from rest_framework import status

from fifteen.tests.factories import FifteenPuzzleFactory


class TestCheckFifteenPuzzleAPI(TestCase):
    def setUp(self) -> None:
        self.fifteen_puzzle = FifteenPuzzleFactory()

    def test_existing_room(self):
        url = reverse(
            "check_existing_fifteen_puzzle",
            kwargs={"username": self.fifteen_puzzle.username},
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["game_exist"], True)

    def test_non_existing_room(self):
        url = reverse(
            "check_existing_fifteen_puzzle", kwargs={"username": "testplayer"}
        )
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["game_exist"], False)
