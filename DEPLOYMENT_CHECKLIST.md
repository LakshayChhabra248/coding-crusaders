# 🚀 Deployment Checklist - Coding Crusaders Portfolio

## Pre-Deployment Verification

### Code Quality
- [x] No syntax errors in Python files
- [x] No JavaScript console errors
- [x] All tests passing (if any)
- [x] All imports working correctly
- [x] No hardcoded secrets in code
- [x] No DEBUG=True in production code

### Static & Media Files
- [x] All CSS files valid
- [x] All JavaScript files valid
- [x] All images optimized
- [x] Media files properly organized
- [ ] Run `python manage.py collectstatic --noinput` (production only)

### Database
- [ ] Create PostgreSQL database on hosting provider
- [ ] Store database credentials securely
- [ ] Plan backup strategy
- [ ] Test migration on staging first

### Security Configuration
- [ ] Generate secure SECRET_KEY (use `python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'`)
- [ ] Set DEBUG=False in environment
- [ ] Configure ALLOWED_HOSTS with your domain
- [ ] Set SECURE_SSL_REDIRECT=True
- [ ] Set SESSION_COOKIE_SECURE=True
- [ ] Set CSRF_COOKIE_SECURE=True
- [ ] Configure HTTPS/SSL certificate
- [ ] Update Google OAuth credentials for production domain

### Environment Setup
- [ ] Copy `.env.example` to `.env`
- [ ] Fill in all environment variables
- [ ] Add `.env` to `.gitignore`
- [ ] Test environment variables load correctly
- [ ] Never commit `.env` file

### Files to Create/Update
- [x] `crusaders_project/settings_production.py` - ✅ Created
- [x] `Procfile` - ✅ Created for Heroku
- [x] `runtime.txt` - ✅ Created (Python 3.11.4)
- [x] `.env.example` - ✅ Created
- [x] `requirements.txt` - ✅ Updated with production packages
- [x] `.gitignore` - ✅ Created

## Deployment Steps (Choose Your Platform)

### For Heroku Users
```bash
# 1. Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# 2. Login to Heroku
heroku login

# 3. Create Heroku app
heroku create coding-crusaders

# 4. Set environment variables
heroku config:set DJANGO_SECRET_KEY='your-secret-key'
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS='coding-crusaders.herokuapp.com,yourdomain.com,www.yourdomain.com'
heroku config:set DB_NAME='your-db-name'
heroku config:set DB_USER='your-db-user'
heroku config:set DB_PASSWORD='your-db-password'
heroku config:set DB_HOST='your-db-host'
heroku config:set EMAIL_HOST_USER='your-email@gmail.com'
heroku config:set EMAIL_HOST_PASSWORD='your-app-password'
heroku config:set GOOGLE_CLIENT_ID='your-google-id'
heroku config:set GOOGLE_CLIENT_SECRET='your-google-secret'

# 5. Add PostgreSQL addon
heroku addons:create heroku-postgresql:standard-0

# 6. Deploy
git push heroku main

# 7. Run migrations
heroku run python manage.py migrate

# 8. Create superuser
heroku run python manage.py createsuperuser

# 9. Collect static files
heroku run python manage.py collectstatic --noinput

# 10. Open app
heroku open
```

### For DigitalOcean App Platform Users
1. Connect your GitHub repository
2. Create App from GitHub repo
3. Configure environment variables in App Platform dashboard
4. Set Build command: `pip install -r requirements.txt && python manage.py collectstatic --noinput`
5. Set Run command: `gunicorn crusaders_project.wsgi`
6. Deploy

### For AWS Users
See full AWS deployment guide in DEPLOYMENT_GUIDE.md

### For PythonAnywhere Users
1. Create account at pythonanywhere.com
2. Create web app and choose Django
3. Clone your repo via Git
4. Configure web app settings
5. Add environment variables
6. Reload web app

## Post-Deployment Verification

### Essential Checks
- [ ] Website loads without errors (https://yourdomain.com)
- [ ] All pages accessible:
  - [ ] Home page
  - [ ] About page
  - [ ] Team page with modal
  - [ ] Projects page with swapping
  - [ ] Gallery with lightbox
  - [ ] Contact form
  - [ ] Achievements page
- [ ] Authentication working:
  - [ ] Email signup
  - [ ] Email login
  - [ ] Google OAuth login
- [ ] Forms working:
  - [ ] Contact form submitting
  - [ ] Messages displaying
- [ ] Media files loading:
  - [ ] Team photos
  - [ ] Project images
  - [ ] Gallery images
- [ ] Static files loading:
  - [ ] CSS styles applied
  - [ ] JavaScript functions working
  - [ ] Font loaded correctly
- [ ] Animations working:
  - [ ] Scroll animations
  - [ ] Color transitions
  - [ ] Card reveals
  - [ ] Lightbox animations

### Performance Checks
- [ ] Page loads in < 3 seconds
- [ ] No JavaScript errors in console
- [ ] No 404 errors in network tab
- [ ] Images optimized and loading
- [ ] No layout shifts

### SEO Verification
- [ ] Meta tags present (view page source)
- [ ] JSON-LD schema present
- [ ] robots.txt accessible at /robots.txt
- [ ] sitemap.xml accessible at /sitemap.xml
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools

### Security Checks
- [ ] HTTPS/SSL working (green lock in browser)
- [ ] No console errors about mixed content
- [ ] No security warnings
- [ ] Cookies are secure (HttpOnly, Secure flags)
- [ ] CSRF protection enabled

### Monitoring Setup
- [ ] Error logging configured
- [ ] Uptime monitoring active
- [ ] Database backups automated
- [ ] Logs accessible
- [ ] Error alerts configured

## Troubleshooting Common Issues

### Static Files Not Loading
```bash
python manage.py collectstatic --noinput --clear
```

### Database Connection Error
- Verify DATABASE_URL or DB_* environment variables
- Check database server is running
- Verify credentials are correct
- Check firewall rules allow connection

### Images Not Displaying
- Check MEDIA_URL and MEDIA_ROOT configuration
- Verify image files exist in media/ folder
- Check file permissions (755 for directories, 644 for files)
- Check web server can read media files

### Google OAuth Not Working
- Update authorized redirect URIs in Google Console
- Include your production domain
- Format: https://yourdomain.com/accounts/google/login/callback

### Email Not Sending
- Verify EMAIL_HOST_USER and EMAIL_HOST_PASSWORD
- For Gmail: use app password, not regular password
- Check email credentials in environment variables
- Test with: `python manage.py shell` then send test email

### 500 Errors
- Check Django error logs
- Verify SECRET_KEY is set
- Verify ALLOWED_HOSTS includes your domain
- Check database connection
- Verify all environment variables are set

## Performance Optimization (Post-Deployment)

- [ ] Enable gzip compression in web server
- [ ] Set cache headers for static files
- [ ] Configure CDN for images (Cloudflare, AWS CloudFront)
- [ ] Enable database query optimization
- [ ] Monitor Core Web Vitals
- [ ] Set up analytics (Google Analytics 4)

## Maintenance

### Weekly
- [ ] Check error logs
- [ ] Monitor uptime
- [ ] Review performance metrics

### Monthly
- [ ] Update security patches
- [ ] Review database performance
- [ ] Check backup status
- [ ] Review user activity

### Quarterly
- [ ] Security audit
- [ ] Performance review
- [ ] Dependencies update
- [ ] Backup restoration test

## Important Files Reference

| File | Purpose |
|------|---------|
| `crusaders_project/settings_production.py` | Production Django settings |
| `.env.example` | Template for environment variables |
| `Procfile` | Heroku deployment configuration |
| `runtime.txt` | Python version specification |
| `requirements.txt` | Python dependencies |
| `.gitignore` | Files to exclude from Git |

## Success Indicators

✅ Website is live and accessible
✅ All pages load without errors
✅ Authentication working (email & Google)
✅ Contact form functional
✅ Gallery and media files displaying
✅ Animations and interactions working
✅ HTTPS/SSL active
✅ SEO optimized (meta tags present)
✅ Monitoring and logging configured
✅ Backups automated
✅ Error handling in place

---

## Next Steps After Deployment

1. **Submit SEO Data**
   - Google Search Console
   - Bing Webmaster Tools
   - Submit sitemap.xml

2. **Setup Monitoring**
   - Sentry for error tracking
   - Google Analytics
   - Uptime monitoring

3. **Configure Backups**
   - Database backups
   - Media files backups
   - Regular restore testing

4. **Security Hardening**
   - Security headers (HSTS, X-Frame-Options, etc.)
   - Regular security updates
   - Penetration testing

5. **Performance Optimization**
   - CDN configuration
   - Database optimization
   - Caching strategy

---

## Need Help?

- Review DEPLOYMENT_GUIDE.md for detailed instructions
- Check logs: `heroku logs --tail` (Heroku) or provider-specific log viewer
- Django documentation: https://docs.djangoproject.com/
- Allauth documentation: https://django-allauth.readthedocs.io/
- Your hosting provider's documentation

---

**Your Coding Crusaders portfolio is ready to go live! 🚀**

Last Updated: 2025-01-09
