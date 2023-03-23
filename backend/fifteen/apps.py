from django.apps import AppConfig


class FifteenConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "fifteen"

    def ready(self):
        import fifteen.signals  # noqa
