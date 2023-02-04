from django.contrib import admin

from .models import TicTacToePlayer, TicTacToeRoom


class TrackPlayersAdmin(admin.TabularInline):
    model = TicTacToePlayer


class RoomAdmin(admin.ModelAdmin):
    inlines = [TrackPlayersAdmin]


admin.site.register(TicTacToeRoom, RoomAdmin)
