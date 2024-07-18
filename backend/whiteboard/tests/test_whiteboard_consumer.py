from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from whiteboard.consumers import WhiteboardConsumer
from whiteboard.tests.factories import WhiteboardFactory, WhiteboardPlayerFactory


class TestWhiteboardConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.whiteboard = WhiteboardFactory(room_name="test")
        self.whiteboard_player = WhiteboardPlayerFactory(
            room=self.whiteboard, username="kamil"
        )

    async def test_send_and_receive_message(self):
        communicator = await WebsocketGameCommunicator.create_game_consumer(
            WhiteboardConsumer, "whiteboard"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.send_json_to(
            {
                "command": "join",
                "user": self.whiteboard_player.username,
                "message": f"{self.whiteboard_player.username} just joined",
                "value": None,
            }
        )
        response = await communicator.receive_json_from()
        assert response == {
            "command": "join",
            "user": self.whiteboard_player.username,
            "message": f"{self.whiteboard_player.username} just joined",
            "value": None,
        }
