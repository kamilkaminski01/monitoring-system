from typing import List

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class UserManager(BaseUserManager):
    use_in_migrations = True

    def create_user(self, email: str, password: str, **extra_fields) -> "User":
        if not email:
            raise ValueError("User must have an email address")
        user = self.model(email=self.normalize_email(email), **extra_fields)
        user.set_password(password)  # type: ignore
        user.save()
        return user  # type: ignore

    def create_superuser(self, email: str, password: str, **extra_fields) -> "User":
        if not password:
            raise TypeError("Superusers must have a password")
        user = self.create_user(email, password, **extra_fields)
        user.is_superuser = True
        user.is_staff = True
        user.save()
        return user


class User(AbstractUser):
    username = None  # type: ignore
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    email = models.EmailField(max_length=150, unique=True)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: List[str] = []

    objects = UserManager()  # type: ignore
