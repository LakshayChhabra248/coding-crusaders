from django.core.management.base import BaseCommand
from django.core.management import call_command
from django.db import connection

class Command(BaseCommand):
    help = 'Ensure all database tables exist'

    def handle(self, *args, **options):
        """Run migrations and create tables"""
        try:
            # Run migrations
            call_command('migrate', '--run-syncdb', '--noinput', verbosity=1)
            self.stdout.write(self.style.SUCCESS('Successfully ran migrations'))
            
            # Verify tables exist
            with connection.cursor() as cursor:
                cursor.execute("""
                    SELECT name FROM sqlite_master 
                    WHERE type='table' AND name NOT LIKE 'sqlite_%'
                """)
                tables = cursor.fetchall()
                self.stdout.write(f"Database has {len(tables)} tables")
                for table in tables:
                    self.stdout.write(f"  - {table[0]}")
                    
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error: {e}'))
