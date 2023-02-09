from django.contrib import admin
from django.http import HttpRequest

from .models import TicTacToePlayer, TicTacToeRoom


class TicTacToePlayersAdmin(admin.TabularInline):
    model = TicTacToePlayer

    def get_readonly_fields(self, request: HttpRequest, obj=None):
        return ("room", "username", "is_active", "is_player")

    def has_add_permission(self, request: HttpRequest, obj=None):
        return False


class TicTacToeRoomAdmin(admin.ModelAdmin):
    inlines = [TicTacToePlayersAdmin]

    def get_readonly_fields(self, request: HttpRequest, obj=None):
        return "room_name", "board_state", "players", "players_turn"


admin.site.register(TicTacToeRoom, TicTacToeRoomAdmin)
