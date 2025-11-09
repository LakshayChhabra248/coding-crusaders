from django.apps import AppConfig
import os


class MainConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'main'

    def ready(self):
        # Attempt to populate the Google SocialApp from environment variables
        # This avoids committing client secrets to source control. If the
        # environment variables are not set, nothing is changed and admin
        # can be used to configure the SocialApp manually.
        try:
            from allauth.socialaccount.models import SocialApp
            from django.contrib.sites.models import Site
        except Exception:
            # allauth may not be installed or importable in some contexts
            return

        client_id = os.environ.get('GOOGLE_CLIENT_ID')
        client_secret = os.environ.get('GOOGLE_CLIENT_SECRET')
        domain = os.environ.get('SITE_DOMAIN', '127.0.0.1:8000')

        if not client_id or not client_secret:
            # nothing to do
            return

        # Ensure site exists
        site, _ = Site.objects.get_or_create(pk=1, defaults={'domain': domain, 'name': 'localhost'})

        # Create or update Google SocialApp
        app, created = SocialApp.objects.get_or_create(provider='google', defaults={
            'name': 'Google',
            'client_id': client_id,
            'secret': client_secret,
        })
        if not created:
            changed = False
            if app.client_id != client_id:
                app.client_id = client_id
                changed = True
            if app.secret != client_secret:
                app.secret = client_secret
                changed = True
            if changed:
                app.save()

        # Attach to site if not attached
        if site not in app.sites.all():
            app.sites.add(site)
