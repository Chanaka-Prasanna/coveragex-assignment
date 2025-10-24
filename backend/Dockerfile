FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PYTHONPATH=/app

WORKDIR /app

# Install system deps (none needed for now)

# Upgrade pip first
RUN pip install --upgrade pip --timeout 1000

# Install Python dependencies first for better caching
COPY requirements.txt ./
RUN pip install -r requirements.txt
    

# Copy application code
COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]


