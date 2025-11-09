from django.core.management.base import BaseCommand
from django.contrib.auth.models import User

class Command(BaseCommand):
    help = 'Create superuser if it does not exist'

    def handle(self, *args, **options):
        if not User.objects.filter(username='lakshaychhabra248').exists():
            User.objects.create_superuser(
                username='lakshaychhabra248',
                email='lakshaychhabra248@gmail.com',
                password='L@ksh@y@Coding_journey248'
            )
            self.stdout.write(self.style.SUCCESS('Superuser created successfully'))
        else:
            self.stdout.write(self.style.SUCCESS('Superuser already exists'))
