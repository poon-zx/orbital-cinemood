web: gunicorn model:app --preload --max-requests 1000
web: node --optimize_for_size --max_old_space_size=460 --gc_interval=100 server.js