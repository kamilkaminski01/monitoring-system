# Generated by Django 4.0.6 on 2023-02-05 11:27

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="BingoRoom",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("room_name", models.CharField(max_length=50)),
                ("players_limit", models.PositiveIntegerField(default=2)),
            ],
        ),
        migrations.CreateModel(
            name="BingoPlayer",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("username", models.CharField(max_length=50)),
                ("is_winner", models.BooleanField(default=False)),
                ("bingo_state", models.JSONField(default=list)),
                (
                    "room",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="bingo.bingoroom",
                    ),
                ),
            ],
        ),
    ]
