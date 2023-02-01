from copy import deepcopy
from typing import List, Optional

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

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

    @classmethod
    def change_fields_in_fieldsets(
        cls,
        additional_general_fields: Optional[List[str]] = None,
        additional_advanced_fields: Optional[List[str]] = None,
        excessive_general_fields: Optional[List[str]] = None,
        excessive_advanced_fields: Optional[List[str]] = None,
        fieldsets=None,
    ):
        if not fieldsets:
            fieldsets = cls.fieldsets
        fieldsets = deepcopy(fieldsets)
        fieldsets_general_fields = list(fieldsets[0][1]["fields"])
        fieldsets_advanced_fields = list(fieldsets[1][1]["fields"])
        if additional_general_fields:
            for field in additional_general_fields:
                fieldsets_general_fields.append(field)
        if excessive_general_fields:
            for field in excessive_general_fields:
                fieldsets_general_fields.remove(field)
        if additional_advanced_fields:
            for field in additional_advanced_fields:
                fieldsets_advanced_fields.append(field)
        if excessive_advanced_fields:
            for field in excessive_advanced_fields:
                fieldsets_advanced_fields.remove(field)
        fieldsets[0][1]["fields"] = fieldsets_general_fields
        fieldsets[1][1]["fields"] = fieldsets_advanced_fields
        return fieldsets

    @classmethod
    def change_fields_in_add_fieldsets(
        cls,
        additional_general_fields: Optional[List[str]] = None,
        additional_advanced_fields: Optional[List[str]] = None,
        excessive_general_fields: Optional[List[str]] = None,
        excessive_advanced_fields: Optional[List[str]] = None,
        add_fieldsets=None,
    ):
        if not add_fieldsets:
            add_fieldsets = cls.add_fieldsets
        add_fieldsets = deepcopy(add_fieldsets)
        add_fieldsets_general_fields = list(add_fieldsets[0][1]["fields"])
        add_fieldsets_advanced_fields = list(add_fieldsets[1][1]["fields"])
        if additional_general_fields:
            for field in additional_general_fields:
                add_fieldsets_general_fields.append(field)
        if excessive_general_fields:
            for field in excessive_general_fields:
                add_fieldsets_general_fields.remove(field)
        if additional_advanced_fields:
            for field in additional_advanced_fields:
                add_fieldsets_advanced_fields.append(field)
        if excessive_advanced_fields:
            for field in excessive_advanced_fields:
                add_fieldsets_advanced_fields.remove(field)
        add_fieldsets[0][1]["fields"] = add_fieldsets_general_fields
        add_fieldsets[1][1]["fields"] = add_fieldsets_advanced_fields
        return add_fieldsets


admin.site.register(User, UsersAdmin)
