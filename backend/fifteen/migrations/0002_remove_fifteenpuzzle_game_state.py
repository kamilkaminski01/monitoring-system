# Generated by Django 4.0.6 on 2023-03-21 16:57

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("fifteen", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="fifteenpuzzle",
            name="game_state",
        ),
    ]
