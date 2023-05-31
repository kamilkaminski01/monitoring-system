from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from bingo.consumers import BingoOnlineRoomsConsumer
from bingo.tests.factories import BingoPlayerFactory, BingoRoomFactory


class TestBingoOnlineRoomsConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.bingo_room = BingoRoomFactory(room_name="test")
        self.bingo_player = BingoPlayerFactory(room=self.bingo_room, username="kamil")
        self.bingo_room.players.add(self.bingo_player)
        self.bingo_room.save()

    async def test_connecting_with_online_rooms(self):
        communicator = await WebsocketGameCommunicator.create_online_objects_consumer(
            BingoOnlineRoomsConsumer, "rooms", "bingo"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        response = await communicator.receive_json_from()
        assert response == {
            "command": "online_rooms",
            "online_rooms": [{"room_name": "test", "room_id": 16}],
        }
        await communicator.disconnect()
