# Generated by Django 4.0.6 on 2023-04-12 15:27

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("whiteboard", "0002_whiteboard_total_players"),
    ]

    operations = [
        migrations.AddField(
            model_name="whiteboard",
            name="board_state",
            field=models.JSONField(default=list),
        ),
    ]
