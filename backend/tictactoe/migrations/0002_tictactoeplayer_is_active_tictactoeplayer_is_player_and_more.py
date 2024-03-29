# Generated by Django 4.0.6 on 2023-02-08 17:22

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("tictactoe", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="tictactoeplayer",
            name="is_active",
            field=models.BooleanField(default=True),
        ),
        migrations.AddField(
            model_name="tictactoeplayer",
            name="is_player",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="tictactoeroom",
            name="players",
            field=models.ManyToManyField(to="tictactoe.tictactoeplayer"),
        ),
    ]
