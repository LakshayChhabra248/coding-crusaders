from django.conf import settings


def privileged_user(request):
    """Expose `is_privileged` in templates for UI decisions.

    A user is privileged when:
    - they are authenticated AND
    - (they are staff/superuser OR their email is in ADMIN_ALLOWED_EMAILS)
    """
    user = getattr(request, 'user', None)
    is_privileged = False
    if user and user.is_authenticated:
        if getattr(user, 'is_staff', False) or getattr(user, 'is_superuser', False):
            is_privileged = True
        else:
            allowed = getattr(settings, 'ADMIN_ALLOWED_EMAILS', []) or []
            if getattr(user, 'email', None) and user.email.lower() in [s.lower() for s in allowed]:
                is_privileged = True
    return {'is_privileged': is_privileged}
