from django.core.management.base import BaseCommand
import os


class Command(BaseCommand):
    help = 'Create or update the Google SocialApp from env vars: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET'

    def handle(self, *args, **options):
        client_id = os.environ.get('GOOGLE_CLIENT_ID')
        client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
        domain = os.environ.get('SITE_DOMAIN', 'coding-crusaders.me')

        if not client_id or not client_secret:
            self.stdout.write(self.style.WARNING('Env vars GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET not fully set - skipping Google OAuth setup'))
            return

        try:
            from allauth.socialaccount.models import SocialApp
            from django.contrib.sites.models import Site
            from django.db import IntegrityError
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'allauth not available: {e}'))
            return

        try:
            site, created = Site.objects.get_or_create(pk=1, defaults={'domain': domain, 'name': 'Coding Crusaders'})
            if not created and site.domain != domain:
                site.domain = domain
                site.name = 'Coding Crusaders'
                site.save()
            
            app, created = SocialApp.objects.get_or_create(
                provider='google', 
                defaults={
                    'name': 'Google', 
                    'client_id': client_id, 
                    'secret': client_secret
                }
            )
            
            changed = False
            if not created:
                if app.client_id != client_id:
                    app.client_id = client_id
                    changed = True
                if app.secret != client_secret:
                    app.secret = client_secret
                    changed = True
                if changed:
                    app.save()

            if site not in app.sites.all():
                app.sites.add(site)

            if created:
                self.stdout.write(self.style.SUCCESS('✓ Google OAuth configured successfully'))
            elif changed:
                self.stdout.write(self.style.SUCCESS('✓ Google OAuth updated'))
            else:
                self.stdout.write(self.style.SUCCESS('✓ Google OAuth already configured'))
        except Exception as e:
            self.stdout.write(self.style.WARNING(f'Could not configure Google OAuth: {e}'))

