import logging
from typing import List

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

logger = logging.getLogger(__name__)
channel_layer = get_channel_layer()


async def websocket_send_event(self, event: dict, field_names: List[str]) -> None:
    payload = {field: event.get(field) for field in field_names}
    await self.send_json(payload)


def send_room_signal(channel_name, instance, command):
    data = {
        "type": "websocket_room_added_or_deleted",
        "command": command,
        "room_name": instance.room_name,
        "room_id": instance.id,
    }
    try:
        async_to_sync(channel_layer.group_send)(channel_name, data)
    except TypeError:
        logger.warning("Failed sending: %s", command)


def send_user_signal(channel_name, instance, command):
    data = {
        "type": "websocket_user_added_or_deleted",
        "command": command,
        "username": instance.username,
    }
    try:
        async_to_sync(channel_layer.group_send)(channel_name, data)
    except TypeError:
        logger.warning("Failed sending: %s", command)


def update_total_players(room_model, player_model, player_instance):
    room_instance = player_instance.room
    active_players = player_model.objects.filter(room=room_instance, is_active=True)
    if active_players.count() == 0:
        room_instance.delete()
    else:
        room_model.objects.filter(id=room_instance.id).update(
            total_players=active_players.count()
        )
