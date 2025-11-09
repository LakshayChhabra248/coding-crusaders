import os
import django
from django.core.wsgi import get_wsgi_application
from django.core.management import call_command

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'crusaders_project.settings')

# Initialize Django first
django.setup()

# Run migrations on startup to ensure all tables exist
try:
    call_command('migrate', '--noinput', verbosity=0)
except Exception as e:
    # Non-fatal - migrations might have already run
    pass

application = get_wsgi_application()
