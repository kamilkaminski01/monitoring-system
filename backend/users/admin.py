from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import Group

from .models import User


class UsersAdmin(UserAdmin):
    exclude = ("username",)
    list_display = [
        "email",
        "first_name",
        "last_name",
        "is_staff",
    ]
    readonly_fields = ["date_joined", "last_login"]
    ordering = ("email",)

    add_fieldsets = (
        (
            "General",
            {
                "classes": ("wide",),
                "fields": [
                    "email",
                    "first_name",
                    "last_name",
                    "password1",
                    "password2",
                ],
            },
        ),
        (
            "Advanced options",
            {
                "classes": ("collapse",),
                "fields": [
                    "is_staff",
                    "is_active",
                    "date_joined",
                    "last_login",
                ],
            },
        ),
    )

    fieldsets = (
        (
            "General",
            {
                "classes": ("wide",),
                "fields": [
                    "email",
                    "first_name",
                    "last_name",
                    "password",
                ],
            },
        ),
        (
            "Advanced options",
            {
                "classes": ("collapse",),
                "fields": [
                    "is_staff",
                    "is_active",
                    "date_joined",
                    "last_login",
                ],
            },
        ),
    )


admin.site.register(User, UsersAdmin)
admin.site.unregister(Group)
