from typing import List


async def websocket_send_event(self, event: dict, field_names: List[str]) -> None:
    payload = {field: event.get(field) for field in field_names}
    await self.send_json(payload)
