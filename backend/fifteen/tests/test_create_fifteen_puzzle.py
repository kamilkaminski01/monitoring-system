from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from fifteen.models import FifteenPuzzle


class TestCreateFifteenPuzzleAPI(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.url = reverse("create_fifteen_puzzle")

    def test_create_bingo_room(self):
        data = {"username": "player", "game_state": True}
        response = self.client.post(self.url, data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        puzzle = FifteenPuzzle.objects.filter(username="player").first()
        self.assertIsNotNone(puzzle)
        self.assertTrue(puzzle.game_state)
        self.assertEqual(puzzle.moves, 0)
