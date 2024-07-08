#!/bin/bash

echo "Collecting static files"
python manage.py collectstatic --no-input

echo "Running migrations"
python manage.py migrate

echo "Creating default admin user"
python manage.py initialize_data

echo "Starting server"
daphne -b 0.0.0.0 -p 8000 backend.asgi:application

exec "$@"
