from django.core.management import BaseCommand, call_command


class Command(BaseCommand):
    help = "Initialize example data"

    def handle(self, **options):
        call_command("loaddata", "users/fixtures/global_data.json")
