#!/bin/bash
echo "Running Alembic migrations..."
alembic -x db_url=$DATABASE_URL upgrade head
echo "Starting FastAPI server..."
uvicorn backend.main:app --host 0.0.0.0 --port 8000
