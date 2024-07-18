from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from fifteen.consumers import FifteenPuzzleOnlineUsersConsumer
from fifteen.tests.factories import FifteenPuzzleFactory


class TestFifteenOnlineUsersConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.fifteen_puzzle = FifteenPuzzleFactory()

    async def test_connecting_with_online_users(self):
        communicator = await WebsocketGameCommunicator.create_online_objects_consumer(
            FifteenPuzzleOnlineUsersConsumer, "users", "fifteen"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        response = await communicator.receive_json_from()
        assert response == {
            "command": "online_users",
            "online_users": [{"username": "player"}],
        }
