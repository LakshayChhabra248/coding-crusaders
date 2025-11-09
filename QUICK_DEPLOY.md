# ⚡ Deployment Quick Reference

## 🎯 Choose Your Platform

### Heroku (Recommended for Beginners)
**Best for:** Quick deployment, free tier available through alternatives, minimal config

```bash
# 1. Install Heroku CLI
curl https://cli.heroku.com/install.sh | sh

# 2. Login
heroku login

# 3. Create app
heroku create coding-crusaders

# 4. Set environment variables (replace with your values)
heroku config:set DJANGO_SECRET_KEY='django-insecure-xxxxx'
heroku config:set DEBUG=False
heroku config:set ALLOWED_HOSTS='coding-crusaders.herokuapp.com,yourdomain.com'

# 5. Add PostgreSQL
heroku addons:create heroku-postgresql:standard-0

# 6. Deploy
git push heroku main

# 7. Migrate database
heroku run python manage.py migrate

# 8. Create admin user
heroku run python manage.py createsuperuser

# 9. Collect static files
heroku run python manage.py collectstatic --noinput

# 10. Open app
heroku open
```

---

### DigitalOcean App Platform (Recommended for More Control)
**Best for:** Balance of ease and control, affordable, good performance

```bash
# 1. Push to GitHub
git add .
git commit -m "Production deployment"
git push origin main

# 2. In DigitalOcean:
#    - Connect GitHub account
#    - Select repository
#    - Choose Python runtime
#    - Set environment variables (see below)
#    - Build command: pip install -r requirements.txt && python manage.py collectstatic --noinput
#    - Run command: gunicorn crusaders_project.wsgi
#    - Deploy

# 3. After deployment:
#    - View logs in dashboard
#    - Monitor performance
#    - Configure custom domain
```

---

### Railway.app (Modern Alternative)
**Best for:** Simple setup, good pricing, modern platform

```bash
# 1. Install Railway CLI
npm i -g @railway/cli

# 2. Login
railway login

# 3. Create project
railway init

# 4. Set environment variables
railway variables set DJANGO_SECRET_KEY='xxx'

# 5. Deploy
railway up
```

---

### AWS (Advanced)
**Best for:** Enterprise, full control, complex setups

See full AWS guide in DEPLOYMENT_GUIDE.md

---

## 🔑 Required Environment Variables

Copy and fill in these values:

```bash
# Security
DJANGO_SECRET_KEY=generate-with: python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Database (PostgreSQL)
DB_NAME=coding_crusaders_db
DB_USER=postgres_user
DB_PASSWORD=your_secure_password
DB_HOST=db.provider.com
DB_PORT=5432

# Email (Gmail example)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password  # NOT your regular password!
DEFAULT_FROM_EMAIL=noreply@yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=xxx.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_secret
```

---

## 📋 Pre-Deployment Checklist

```bash
# 1. Verify code
git status  # Should be clean

# 2. Test locally
python manage.py runserver

# 3. Create SECRET_KEY
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'

# 4. Collect static files
python manage.py collectstatic --noinput --clear

# 5. Check for errors
python manage.py check
```

---

## 🚀 Quick Commands by Platform

### Heroku
```bash
# View logs
heroku logs --tail

# Run commands
heroku run python manage.py migrate
heroku run python manage.py shell

# Update environment variable
heroku config:set KEY=value

# View all variables
heroku config

# Open app
heroku open

# Restart app
heroku restart
```

### DigitalOcean
```bash
# View in dashboard
# Logs: Components > Logs
# Environment: Components > Environment tab

# Via API (if needed)
# Use doctl CLI: doctl apps create-deployment <app-id>
```

### Railway
```bash
# View logs
railway logs

# Set variable
railway variables set KEY=value

# Deploy
railway up

# View dashboard
railway open
```

---

## ✅ Post-Deployment Testing

```
Website: https://yourdomain.com
Admin: https://yourdomain.com/admin

Test these:
☐ Home page loads
☐ About page works
☐ Team page (modal opens)
☐ Projects page (swapping works)
☐ Gallery (lightbox works)
☐ Contact form (submits)
☐ Login/Signup (email works)
☐ Google OAuth (works)
☐ Images load from media
☐ CSS/JS working
☐ Meta tags present (view source)
☐ HTTPS active (green lock)
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Static files not loading | `python manage.py collectstatic --noinput --clear` |
| Images not showing | Check MEDIA_URL, MEDIA_ROOT, file permissions |
| Database error | Verify DB credentials, check database is running |
| 500 error | Check error logs, verify SECRET_KEY, ALLOWED_HOSTS |
| Google OAuth fails | Update redirect URI in Google Console |
| Email not sending | Check EMAIL_HOST_USER, EMAIL_HOST_PASSWORD (app password for Gmail) |
| "No module named X" | Run `pip install -r requirements.txt` |

---

## 📚 Important Files

| File | Purpose |
|------|---------|
| `.env` | Environment variables (NEVER commit!) |
| `Procfile` | Heroku configuration |
| `runtime.txt` | Python version for Heroku |
| `requirements.txt` | Python dependencies |
| `crusaders_project/settings_production.py` | Production settings |
| `.gitignore` | Files to exclude from Git |

---

## 💡 Tips

1. **SECRET_KEY**: Generate new one for production
   ```bash
   python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
   ```

2. **Gmail App Password**: Don't use regular password
   - Enable 2FA on Gmail
   - Create app password in account settings
   - Use that password in EMAIL_HOST_PASSWORD

3. **Database**: Always use PostgreSQL in production, not SQLite

4. **HTTPS**: Ensure your domain has SSL/TLS certificate

5. **Backups**: Automate database backups daily

6. **Monitoring**: Set up error tracking (Sentry) and uptime monitoring

---

## 🎓 Learning Resources

- Django Docs: https://docs.djangoproject.com/
- Heroku Django Guide: https://devcenter.heroku.com/articles/deploying-python
- DigitalOcean App Platform: https://docs.digitalocean.com/products/app-platform/
- Railway Docs: https://docs.railway.app/
- Allauth: https://django-allauth.readthedocs.io/

---

## 🎉 Success = 

✅ Domain points to your app
✅ All pages load without errors
✅ HTTPS active
✅ Authentication working
✅ Forms functional
✅ Media files display
✅ Monitoring active
✅ Backups configured

**You're live! 🚀**

---

**For detailed instructions, see DEPLOYMENT_GUIDE.md**

**For complete checklist, see DEPLOYMENT_CHECKLIST.md**
