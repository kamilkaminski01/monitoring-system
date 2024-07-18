from django.test import TransactionTestCase

from backend.tests.websocket_communicator import WebsocketGameCommunicator
from whiteboard.consumers import WhiteboardOnlineRoomsConsumer
from whiteboard.tests.factories import WhiteboardFactory


class TestWhiteboardOnlineRoomsConsumer(TransactionTestCase):
    def setUp(self) -> None:
        self.whiteboard = WhiteboardFactory()

    async def test_connecting_with_online_rooms(self):
        communicator = await WebsocketGameCommunicator.create_online_objects_consumer(
            WhiteboardOnlineRoomsConsumer, "rooms", "whiteboard"
        )
        connected, subprotocol = await communicator.connect()
        assert connected
        response = await communicator.receive_json_from()
        assert response == {
            "command": "online_rooms",
            "online_rooms": [{"room_name": "whiteboard", "room_id": 10}],
        }
