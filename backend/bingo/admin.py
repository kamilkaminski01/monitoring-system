from django.contrib import admin

from .models import BingoPlayer, BingoRoom


class TrackPlayersAdmin(admin.TabularInline):
    model = BingoPlayer


class RoomAdmin(admin.ModelAdmin):
    inlines = [TrackPlayersAdmin]


admin.site.register(BingoRoom, RoomAdmin)
