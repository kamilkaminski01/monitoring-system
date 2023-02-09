from django.contrib import admin
from django.http import HttpRequest

from .models import BingoPlayer, BingoRoom


class BingoPlayersAdmin(admin.TabularInline):
    model = BingoPlayer

    def get_readonly_fields(self, request: HttpRequest, obj=None):
        return (
            "room",
            "username",
            "is_active",
            "is_player",
            "is_winner",
            "initial_board_state",
            "bingo_state",
        )

    def has_add_permission(self, request: HttpRequest, obj=None):
        return False


class BingoRoomAdmin(admin.ModelAdmin):
    inlines = [BingoPlayersAdmin]

    def get_readonly_fields(self, request: HttpRequest, obj=None):
        return "room_name", "players_limit", "players", "players_turn", "board_state"


admin.site.register(BingoRoom, BingoRoomAdmin)
