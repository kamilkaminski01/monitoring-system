from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from fifteen.consumers import FifteenPuzzleConsumer
from fifteen.tests.factories import FifteenPuzzleFactory


class TestFifteenPuzzleConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.fifteen_puzzle = FifteenPuzzleFactory()

    async def test_send_and_receive_message(self):
        communicator = await WebsocketGameCommunicator.create_game_consumer(
            FifteenPuzzleConsumer, "fifteen"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.send_json_to(
            {
                "command": "join",
                "user": self.fifteen_puzzle.username,
                "message": f"{self.fifteen_puzzle.username} just joined",
                "value": None,
            }
        )
        response = await communicator.receive_json_from()
        assert response == {
            "command": "join",
            "user": self.fifteen_puzzle.username,
            "message": f"{self.fifteen_puzzle.username} just joined",
            "value": None,
        }
        await communicator.disconnect()
