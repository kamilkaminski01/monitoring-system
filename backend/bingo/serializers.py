from rest_framework import serializers

from .models import BingoPlayer, BingoRoom


class BingoSerializer(serializers.ModelSerializer):
    class Meta:
        model = BingoRoom
        fields = ("room_name", "players_limit")


class BingoPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BingoPlayer
        fields = (
            "username",
            "is_active",
            "is_winner",
            "bingo_state",
            "initial_board_state",
        )


class BingoRoomDetailsSerializer(serializers.ModelSerializer):
    players = BingoPlayerSerializer(many=True, read_only=True)
    players_turn = serializers.CharField(
        source="players_turn.username", allow_null=True
    )

    class Meta:
        model = BingoRoom
        fields = (
            "room_name",
            "players_limit",
            "players_turn",
            "board_state",
            "players",
        )
