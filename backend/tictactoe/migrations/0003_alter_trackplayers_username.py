# Generated by Django 4.0.6 on 2022-12-29 11:24

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("tictactoe", "0002_tictactoeroom_trackplayers_delete_game"),
    ]

    operations = [
        migrations.AlterField(
            model_name="trackplayers",
            name="username",
            field=models.CharField(max_length=50),
        ),
    ]