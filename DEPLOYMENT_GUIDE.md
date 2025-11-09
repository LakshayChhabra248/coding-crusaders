# Coding Crusaders - Deployment Guide

This guide walks you through deploying the Coding Crusaders Django portfolio to production.

## Table of Contents
1. [Pre-Deployment Checklist](#pre-deployment-checklist)
2. [Environment Setup](#environment-setup)
3. [Deployment Options](#deployment-options)
4. [Post-Deployment](#post-deployment)

---

## Pre-Deployment Checklist

### ✅ Security Settings
- [ ] Generate a new `SECRET_KEY` for production
- [ ] Set `DEBUG = False`
- [ ] Update `ALLOWED_HOSTS` with your domain(s)
- [ ] Configure HTTPS/SSL certificates
- [ ] Set up environment variables for sensitive data

### ✅ Database
- [ ] Use a production database (PostgreSQL recommended)
- [ ] Run `python manage.py migrate` on production database
- [ ] Back up the database

### ✅ Static & Media Files
- [ ] Collect static files: `python manage.py collectstatic --noinput`
- [ ] Configure media file storage (AWS S3 recommended)
- [ ] Set proper permissions on media folders

### ✅ Code Review
- [ ] All tests passing
- [ ] No DEBUG=True in production code
- [ ] No hardcoded secrets in code
- [ ] No development-only imports

---

## Environment Setup

### 1. Create Production Settings File

Create `crusaders_project/settings_production.py`:

```python
from .settings import *
import os

# Security settings
DEBUG = False
SECRET_KEY = os.environ.get('DJANGO_SECRET_KEY')
ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', 'codingcrusaders.com,www.codingcrusaders.com').split(',')

# HTTPS Configuration
SECURE_SSL_REDIRECT = True
SESSION_COOKIE_SECURE = True
CSRF_COOKIE_SECURE = True
SECURE_BROWSER_XSS_FILTER = True
X_FRAME_OPTIONS = 'DENY'

# Database Configuration
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DB_NAME'),
        'USER': os.environ.get('DB_USER'),
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': os.environ.get('DB_HOST'),
        'PORT': os.environ.get('DB_PORT', '5432'),
    }
}

# Static Files - Using AWS S3 (optional but recommended)
# STATIC_URL = 'https://your-s3-bucket.s3.amazonaws.com/static/'
# MEDIA_URL = 'https://your-s3-bucket.s3.amazonaws.com/media/'

# Email Configuration
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = os.environ.get('EMAIL_HOST')
EMAIL_PORT = int(os.environ.get('EMAIL_PORT', 587))
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.environ.get('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_HOST_PASSWORD')
DEFAULT_FROM_EMAIL = os.environ.get('DEFAULT_FROM_EMAIL')

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/django/error.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}

# Allowed admin emails
ADMIN_ALLOWED_EMAILS = os.environ.get('ADMIN_ALLOWED_EMAILS', '').split(',')
```

### 2. Environment Variables (.env file)

Create a `.env` file (add to `.gitignore`):

```bash
# Django Settings
DJANGO_SECRET_KEY=your-super-secret-key-here
DEBUG=False
ALLOWED_HOSTS=codingcrusaders.com,www.codingcrusaders.com

# Database
DB_NAME=coding_crusaders_db
DB_USER=postgres_user
DB_PASSWORD=secure_password
DB_HOST=localhost
DB_PORT=5432

# Email
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@codingcrusaders.com

# Admin Emails
ADMIN_ALLOWED_EMAILS=admin@example.com,you@example.com
```

### 3. Update requirements.txt for Production

```bash
# Add these for production deployment:
pip install gunicorn
pip install psycopg2-binary
pip install python-decouple
pip install whitenoise
```

Update `requirements.txt`:

```
Django>=4.2
django-allauth>=0.58.0
Pillow>=9.0
gunicorn>=20.1.0
psycopg2-binary>=2.9.0
python-decouple>=3.8
whitenoise>=6.0
```

---

## Deployment Options

### Option 1: Heroku (Easiest for Beginners)

1. **Install Heroku CLI** and login:
   ```bash
   heroku login
   ```

2. **Create Heroku app:**
   ```bash
   heroku create coding-crusaders
   ```

3. **Add Procfile** (create `Procfile` in root):
   ```
   web: gunicorn crusaders_project.wsgi --log-file -
   ```

4. **Add runtime.txt** (optional, specify Python version):
   ```
   python-3.11.4
   ```

5. **Configure environment variables:**
   ```bash
   heroku config:set DJANGO_SECRET_KEY='your-secret-key'
   heroku config:set DEBUG=False
   heroku config:set ALLOWED_HOSTS='coding-crusaders.herokuapp.com'
   heroku config:set DATABASE_URL='postgres://...'
   ```

6. **Run migrations:**
   ```bash
   heroku run python manage.py migrate
   ```

7. **Deploy:**
   ```bash
   git push heroku main
   ```

### Option 2: DigitalOcean App Platform

1. **Connect GitHub repository** to DigitalOcean
2. **Create App** and select your repo
3. **Configure environment:**
   - Add environment variables in App Platform dashboard
   - Set Python runtime
4. **Deploy** - DigitalOcean automatically builds and deploys

### Option 3: AWS (EC2 + RDS + CloudFront)

1. **EC2 Instance:**
   - Launch Ubuntu 22.04 instance
   - SSH into instance
   - Install Python, PostgreSQL, nginx, gunicorn

2. **Setup Application:**
   ```bash
   git clone your-repo.git
   cd coding-crusaders
   python -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

3. **Configure Gunicorn:**
   ```bash
   gunicorn crusaders_project.wsgi --bind 0.0.0.0:8000
   ```

4. **Setup Nginx** as reverse proxy
5. **Configure SSL** with Let's Encrypt

### Option 4: PythonAnywhere (Simple Alternative)

1. Create account on PythonAnywhere.com
2. Upload code via Git
3. Configure Web app settings
4. Set environment variables
5. Run migrations via console
6. Reload web app

---

## Production Settings Checklist

```python
# crusaders_project/settings.py
DEBUG = False  # ✅ MUST be False
SECRET_KEY = os.environ['DJANGO_SECRET_KEY']  # ✅ From environment
ALLOWED_HOSTS = ['yourdomain.com', 'www.yourdomain.com']  # ✅ Your actual domain
SECURE_SSL_REDIRECT = True  # ✅ Force HTTPS
SESSION_COOKIE_SECURE = True  # ✅ Secure cookies
CSRF_COOKIE_SECURE = True  # ✅ CSRF protection
```

---

## Post-Deployment

### ✅ Verify Deployment
- Test all pages load correctly
- Test authentication (login/signup/Google OAuth)
- Test contact form
- Test file uploads
- Verify images load from media folder
- Test gallery lightbox
- Check console for JavaScript errors

### ✅ Setup Monitoring
- Configure error logging (Sentry recommended)
- Set up uptime monitoring (StatusPage, Pingdom)
- Monitor database performance
- Set up automated backups

### ✅ Setup Domain
- Update DNS to point to your server
- Configure SSL/TLS certificate (Let's Encrypt free)
- Set up domain email forwarding if needed

### ✅ Performance Optimization
- Enable gzip compression
- Configure cache headers
- Consider CDN for static files (Cloudflare, AWS CloudFront)
- Optimize database queries
- Monitor response times

### ✅ SEO Verification
- Submit sitemap to Google Search Console
- Submit robots.txt verification
- Monitor search rankings
- Set up Google Analytics
- Monitor Core Web Vitals

---

## Deployment Command Reference

### Deploy to Heroku
```bash
git push heroku main
heroku open
```

### View Logs
```bash
heroku logs --tail
```

### Run Django Management Commands
```bash
heroku run python manage.py collectstatic
heroku run python manage.py migrate
heroku run python manage.py shell
```

### Update Production Settings
```bash
heroku config:set KEY=value
```

---

## Troubleshooting

### Static Files Not Loading
```bash
python manage.py collectstatic --noinput
python manage.py collectstatic --noinput --clear
```

### Database Migrations Failed
```bash
python manage.py migrate --plan  # See what would run
python manage.py migrate main  # Run for specific app
python manage.py showmigrations  # See migration status
```

### 500 Error in Production
- Check error logs
- Verify database connection
- Check SECRET_KEY is set
- Verify ALLOWED_HOSTS includes your domain
- Check media/static file paths

### Google OAuth Not Working
- Verify Google credentials in settings
- Update authorized redirect URIs in Google Console
- Check SITE_ID in database

---

## Success Checklist

- ✅ App deployed and accessible
- ✅ HTTPS/SSL working
- ✅ Database migrated
- ✅ Static files serving correctly
- ✅ Media files accessible
- ✅ Authentication working
- ✅ Email sending configured
- ✅ Logging configured
- ✅ Backups automated
- ✅ Monitoring active
- ✅ Domain pointing to server
- ✅ SEO configured

Your Coding Crusaders portfolio is now ready for production! 🚀
