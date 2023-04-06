from django.contrib import admin
from django.http import HttpRequest

from .models import Whiteboard, WhiteboardPlayer


class WhiteboardPlayerAdmin(admin.TabularInline):
    model = WhiteboardPlayer

    def get_readonly_fields(self, request: HttpRequest, obj=None):
        return "room", "username", "is_active"


class WhiteboardAdmin(admin.ModelAdmin):
    inlines = [WhiteboardPlayerAdmin]

    def get_readonly_fields(self, request: HttpRequest, obj=None):
        return "room_name", "total_players", "players"


admin.site.register(Whiteboard, WhiteboardAdmin)
