# Generated by Django 4.0.6 on 2023-04-01 19:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("bingo", "0009_bingoplayer_is_ready"),
    ]

    operations = [
        migrations.AddField(
            model_name="bingoroom",
            name="players_queue",
            field=models.JSONField(default=list),
        ),
    ]
