release: python manage.py migrate --noinput; python manage.py configure_socialapp
web: python manage.py collectstatic --noinput --clear 2>/dev/null; exec gunicorn crusaders_project.wsgi:application --log-file -
