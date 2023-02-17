from typing import List


async def websocket_send_event(self, event: dict, field_names: List[str]) -> None:
    payload = {key: event[key] for key in field_names}
    await self.send_json(payload)
