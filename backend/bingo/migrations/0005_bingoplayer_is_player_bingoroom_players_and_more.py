# Generated by Django 4.0.6 on 2023-02-09 15:44

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bingo", "0004_bingoplayer_is_active"),
    ]

    operations = [
        migrations.AddField(
            model_name="bingoplayer",
            name="is_player",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="bingoroom",
            name="players",
            field=models.ManyToManyField(
                limit_choices_to={"is_player": True},
                related_name="players",
                to="bingo.bingoplayer",
            ),
        ),
        migrations.AddField(
            model_name="bingoroom",
            name="players_turn",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="players_turn",
                to="bingo.bingoplayer",
            ),
        ),
    ]
