from rest_framework import serializers

from .models import Whiteboard, WhiteboardPlayer


class WhiteboardSerializer(serializers.ModelSerializer):
    player = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = Whiteboard
        fields = ["room_name", "player"]


class WhiteboardPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = WhiteboardPlayer
        fields = ["username", "is_active"]


class WhiteboardRoomDetailsSerializer(serializers.ModelSerializer):
    players = serializers.SerializerMethodField()

    def get_players(self, obj):
        players = obj.players.all().order_by("id")
        return WhiteboardPlayerSerializer(players, many=True).data

    class Meta:
        model = Whiteboard
        read_only_fields = ["room_name", "total_players", "players"]
        fields = ["room_name", "total_players", "players"]
