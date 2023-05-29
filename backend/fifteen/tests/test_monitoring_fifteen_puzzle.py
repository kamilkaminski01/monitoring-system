import json

from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from rest_framework_simplejwt.tokens import RefreshToken

from fifteen.models import FifteenPuzzle
from fifteen.serializers import FifteenPuzzleDetailsSerializer
from fifteen.tests.factories import FifteenPuzzleFactory
from users.models import User


class FifteenPuzzleMonitoringAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.fifteen_puzzle = FifteenPuzzleFactory()
        self.admin = User.objects.create_user(
            email="admin@admin.com", password="Admin-123"
        )
        self.url = reverse(
            "monitoring_fifteen_puzzle",
            kwargs={"username": self.fifteen_puzzle.username},
        )
        refresh = RefreshToken.for_user(self.admin)
        self.auth_headers = {"HTTP_AUTHORIZATION": f"Bearer {refresh.access_token}"}

    def test_retrieve_fifteen_puzzle_details(self):
        response = self.client.get(self.url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        serializer = FifteenPuzzleDetailsSerializer(self.fifteen_puzzle)
        self.assertEqual(response.data, serializer.data)

    def test_delete_fifteen_puzzle(self):
        response = self.client.delete(self.url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(
            FifteenPuzzle.objects.filter(username=self.fifteen_puzzle.username).exists()
        )

    def test_delete_non_existing_fifteen_puzzle(self):
        non_existing_puzzle_url = reverse(
            "monitoring_fifteen_puzzle", kwargs={"username": "NonExistingPuzzle"}
        )
        response = self.client.delete(non_existing_puzzle_url, **self.auth_headers)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_retrieve_fifteen_puzzle_not_authenticated(self):
        response = self.client.get(self.url)
        response_data = json.loads(response.content)
        self.assertEqual(401, response.status_code)
        self.assertEqual(response_data.get("code"), "not_authenticated")
