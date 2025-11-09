web: python manage.py migrate --run-syncdb && python manage.py collectstatic --noinput && gunicorn crusaders_project.wsgi:application --log-file - --workers 1
