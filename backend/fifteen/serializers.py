from rest_framework import serializers

from .models import FifteenPuzzle


class FifteenPuzzleSerializer(serializers.ModelSerializer):
    class Meta:
        model = FifteenPuzzle
        fields = (
            "username",
            "game_state",
        )


class FifteenPuzzleDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = FifteenPuzzle
        fields = (
            "board_state",
            "moves",
        )
