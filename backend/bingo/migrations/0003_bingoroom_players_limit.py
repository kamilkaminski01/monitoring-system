# Generated by Django 4.0.6 on 2023-01-29 22:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bingo", "0002_trackplayers_is_winner"),
    ]

    operations = [
        migrations.AddField(
            model_name="bingoroom",
            name="players_limit",
            field=models.PositiveIntegerField(default=2),
        ),
    ]
