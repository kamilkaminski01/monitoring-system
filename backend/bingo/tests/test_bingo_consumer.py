from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from bingo.consumers import BingoConsumer
from bingo.tests.factories import BingoPlayerFactory, BingoRoomFactory


class TestBingoConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.bingo_room = BingoRoomFactory(room_name="test")
        self.bingo_player = BingoPlayerFactory(room=self.bingo_room, username="kamil")
        self.bingo_room.players.add(self.bingo_player)
        self.bingo_room.save()

    async def test_send_and_receive_message(self):
        communicator = await WebsocketGameCommunicator.create_game_consumer(
            BingoConsumer, "bingo"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.send_json_to(
            {
                "command": "join",
                "user": self.bingo_player.username,
                "message": f"{self.bingo_player.username} just joined",
                "value": None,
            }
        )
        response = await communicator.receive_json_from()
        assert response == {
            "command": "join",
            "user": self.bingo_player.username,
            "message": f"{self.bingo_player.username} just joined",
            "value": None,
        }
        await communicator.disconnect()
