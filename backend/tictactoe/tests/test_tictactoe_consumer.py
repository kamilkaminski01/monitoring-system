from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from tictactoe.consumers import TicTacToeConsumer
from tictactoe.tests.factories import TicTacToePlayerFactory, TicTacToeRoomFactory


class TestTicTacToeConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.tictactoe_room = TicTacToeRoomFactory(room_name="test")
        self.tictactoe_player = TicTacToePlayerFactory(
            room=self.tictactoe_room, username="kamil"
        )
        self.tictactoe_room.players.add(self.tictactoe_player)
        self.tictactoe_room.save()

    async def test_send_and_receive_message(self):
        communicator = await WebsocketGameCommunicator.create_game_consumer(
            TicTacToeConsumer, "tictactoe"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        await communicator.send_json_to(
            {
                "command": "join",
                "user": self.tictactoe_player.username,
                "message": f"{self.tictactoe_player.username} just joined",
                "value": None,
            }
        )
        response = await communicator.receive_json_from()
        assert response == {
            "command": "join",
            "user": self.tictactoe_player.username,
            "message": f"{self.tictactoe_player.username} just joined",
            "value": None,
        }
        await communicator.disconnect()
