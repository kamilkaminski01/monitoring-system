from typing import List, Union

from bingo.models import BingoRoom
from tictactoe.models import TicTacToeRoom


async def websocket_send_event(self, event: dict, field_names: List[str]) -> None:
    payload = {field: event.get(field) for field in field_names}
    await self.send_json(payload)


def get_room_data(instance: Union[BingoRoom, TicTacToeRoom], command: str) -> dict:
    return {
        "type": "websocket_room_added_or_deleted",
        "command": command,
        "room_name": instance.room_name,
        "room_id": instance.id,
    }
