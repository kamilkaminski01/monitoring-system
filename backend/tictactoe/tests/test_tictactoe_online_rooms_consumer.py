from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from tictactoe.consumers import TicTacToeOnlineRoomsConsumer
from tictactoe.tests.factories import TicTacToePlayerFactory, TicTacToeRoomFactory


class TestTicTacToeOnlineRoomsConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.tictactoe_room = TicTacToeRoomFactory(room_name="test")
        self.tictactoe_player = TicTacToePlayerFactory(
            room=self.tictactoe_room, username="kamil"
        )
        self.tictactoe_room.players.add(self.tictactoe_player)
        self.tictactoe_room.save()

    async def test_connecting_with_online_rooms(self):
        communicator = await WebsocketGameCommunicator.create_online_objects_consumer(
            TicTacToeOnlineRoomsConsumer, "rooms", "tictactoe"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        response = await communicator.receive_json_from()
        assert response == {
            "command": "online_rooms",
            "online_rooms": [{"room_name": "test", "room_id": 15}],
        }
