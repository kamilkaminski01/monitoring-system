# Generated by Django 4.0.6 on 2023-03-04 20:19

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tictactoe", "0004_remove_tictactoeplayer_is_player_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="tictactoeplayer",
            name="figure",
            field=models.CharField(blank=True, max_length=1, null=True),
        ),
    ]
