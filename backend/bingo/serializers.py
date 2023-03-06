from rest_framework import serializers

from .models import BingoPlayer, BingoRoom


class BingoSerializer(serializers.ModelSerializer):
    player = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = BingoRoom
        fields = (
            "room_name",
            "player",
            "players_limit",
        )


class BingoPlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = BingoPlayer
        read_only_fields = (
            "username",
            "is_active",
        )
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
        source="players_turn.username", allow_null=True, read_only=True
    )

    class Meta:
        model = BingoRoom
        read_only_fields = (
            "room_name",
            "total_players",
            "players_limit",
            "players",
        )
        fields = (
            "room_name",
            "game_state",
            "total_players",
            "players_limit",
            "players_turn",
            "board_state",
            "players",
        )
