from rest_framework import serializers

from .models import TicTacToePlayer, TicTacToeRoom


class TicTacToeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicTacToeRoom
        fields = ("room_name",)


class TicTacToePlayerSerializer(serializers.ModelSerializer):
    class Meta:
        model = TicTacToePlayer
        fields = ("username", "is_active")


class TicTacToeRoomDetailsSerializer(serializers.ModelSerializer):
    players = TicTacToePlayerSerializer(many=True, read_only=True)
    players_turn = serializers.CharField(
        source="players_turn.username", allow_null=True
    )

    class Meta:
        model = TicTacToeRoom
        fields = ("room_name", "board_state", "players_turn", "players")
