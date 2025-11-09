web: python manage.py migrate --run-syncdb && python manage.py configure_socialapp; python manage.py collectstatic --noinput --clear; exec gunicorn crusaders_project.wsgi:application --log-file -
