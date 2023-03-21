from django.contrib import admin

from .models import FifteenPuzzle


class FifteenPuzzleAdmin(admin.ModelAdmin):
    list_display = ["username", "board_state", "game_state", "moves"]
    readonly_fields = ["username", "board_state", "game_state", "moves"]


admin.site.register(FifteenPuzzle, FifteenPuzzleAdmin)
