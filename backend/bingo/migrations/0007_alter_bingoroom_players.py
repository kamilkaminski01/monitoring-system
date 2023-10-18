# Generated by Django 4.0.6 on 2023-02-28 09:06

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("bingo", "0006_remove_bingoplayer_is_player_bingoroom_total_players_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bingoroom",
            name="players",
            field=models.ManyToManyField(
                blank=True, related_name="players", to="bingo.bingoplayer"
            ),
        ),
    ]
