from rest_framework import serializers

from .models import TicTacToePlayer, TicTacToeRoom


class TicTacToeSerializer(serializers.ModelSerializer):
    player = serializers.CharField(required=False, allow_null=True)

    class Meta:
        model = TicTacToeRoom
        fields = (
            "room_name",
            "player",
        )


class TicTacToePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicTacToePlayer
        read_only_fields = (
            "username",
            "is_active",
            "figure",
        )
        fields = (
            "username",
            "is_active",
            "is_winner",
            "is_ready",
            "figure",
        )


class TicTacToeRoomDetailsSerializer(serializers.ModelSerializer):
    players = serializers.SerializerMethodField()

    def get_players(self, obj):
        players = obj.players.all().order_by("id")
        return TicTacToePlayerSerializer(players, many=True).data

    players_turn = serializers.CharField(
        source="players_turn.username", allow_null=True, read_only=True
    )

    class Meta:
        model = TicTacToeRoom
        read_only_fields = (
            "room_name",
            "total_players",
            "players",
        )
        fields = (
            "room_name",
            "total_players",
            "game_state",
            "board_state",
            "players_turn",
            "players",
        )
