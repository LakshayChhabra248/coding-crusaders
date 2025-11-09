# Django SEO Settings Configuration

# Add these settings to your Django settings.py for better SEO performance

# ============================================================
# SEO & Performance Settings
# ============================================================

# SECURITY - Enable for production
# SECURE_SSL_REDIRECT = True
# SESSION_COOKIE_SECURE = True
# CSRF_COOKIE_SECURE = True
# SECURE_HSTS_SECONDS = 31536000
# SECURE_HSTS_INCLUDE_SUBDOMAINS = True
# SECURE_HSTS_PRELOAD = True
# X_FRAME_OPTIONS = 'DENY'

# Search Engine Optimization
SEO_ENABLED = True
SEO_SITEMAP_URL = 'https://codingcrusaders.com/sitemap.xml'

# Robots.txt location (static files)
ROBOTS_TXT_LOCATION = 'robots.txt'

# ============================================================
# Caching Configuration
# ============================================================

CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.locmem.LocMemCache',
        'LOCATION': 'unique-snowflake',
        'OPTIONS': {
            'MAX_ENTRIES': 1000
        }
    }
}

# Cache timeout for pages (in seconds)
CACHE_TIMEOUT = 3600  # 1 hour

# ============================================================
# Middleware for Performance
# ============================================================

MIDDLEWARE = [
    # ... other middleware ...
    'django.middleware.cache.UpdateCacheMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.cache.FetchFromCacheMiddleware',
    # ... rest of middleware ...
]

# ============================================================
# Database Query Optimization
# ============================================================

# Enable select_related and prefetch_related in querysets
# This reduces the number of database queries

# Example in views.py:
# projects = Project.objects.prefetch_related('images').all()
# team_members = TeamMember.objects.all()

# ============================================================
# Static Files Configuration for CDN/Caching
# ============================================================

STATIC_URL = '/static/'
STATIC_ROOT = 'static'
STATICFILES_DIRS = []

# Use whitenoise for serving static files efficiently
# Add to MIDDLEWARE: 'whitenoise.middleware.WhiteNoiseMiddleware'

# Enable gzip compression in whitenoise
STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'

# ============================================================
# Media Files Configuration
# ============================================================

MEDIA_URL = '/media/'
MEDIA_ROOT = 'media'

# ============================================================
# Email Configuration for Contact Forms
# ============================================================

EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'  # or your email provider
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = 'your-email@gmail.com'
EMAIL_HOST_PASSWORD = 'your-app-password'
DEFAULT_FROM_EMAIL = 'noreply@codingcrusaders.com'

# ============================================================
# Allowed Hosts for Production
# ============================================================

ALLOWED_HOSTS = [
    'codingcrusaders.com',
    'www.codingcrusaders.com',
    'localhost',
    '127.0.0.1',
]

# ============================================================
# Admin Allowed Emails (for studio access)
# ============================================================

ADMIN_ALLOWED_EMAILS = [
    'admin@codingcrusaders.com',
    'team@codingcrusaders.com',
    # Add team member emails here
]

# ============================================================
# Database Configuration for Production
# ============================================================

# Development (SQLite)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': 'db.sqlite3',
    }
}

# Production (PostgreSQL - recommended)
# DATABASES = {
#     'default': {
#         'ENGINE': 'django.db.backends.postgresql',
#         'NAME': 'codingcrusaders',
#         'USER': 'postgres',
#         'PASSWORD': 'your_password',
#         'HOST': 'localhost',
#         'PORT': '5432',
#         'CONN_MAX_AGE': 600,
#     }
# }

# ============================================================
# Django Debug Toolbar (Development Only)
# ============================================================

# if DEBUG:
#     INSTALLED_APPS += ['debug_toolbar']
#     MIDDLEWARE += ['debug_toolbar.middleware.DebugToolbarMiddleware']
#     INTERNAL_IPS = ['127.0.0.1']

# ============================================================
# Logging Configuration for Debugging
# ============================================================

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': 'logs/django.log',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'WARNING',
    },
}

# ============================================================
# Compression Settings
# ============================================================

# For Gunicorn + nginx in production
GZIP_LEVEL = 6
COMPRESS_OFFLINE = True

# ============================================================
# Content Security Policy (CSP)
# ============================================================

# Add to MIDDLEWARE: 'csp.middleware.CSPMiddleware'
CSP_DEFAULT_SRC = ("'self'",)
CSP_SCRIPT_SRC = (
    "'self'",
    'cdnjs.cloudflare.com',
    'fonts.googleapis.com',
)
CSP_STYLE_SRC = (
    "'self'",
    'fonts.googleapis.com',
    "'unsafe-inline'",
)
CSP_FONT_SRC = (
    "'self'",
    'fonts.gstatic.com',
)
