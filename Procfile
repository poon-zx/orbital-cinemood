web: gunicorn model:app --preload --max-requests 1000 --timeout 90
worker: celery worker --app=app.celery --loglevel=info