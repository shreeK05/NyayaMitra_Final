# NyayaMitra Backend — Multi-stage Dockerfile
FROM python:3.13-slim AS builder

WORKDIR /app

# Install system dependencies for ChromaDB, lxml, etc.
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential gcc g++ libpq-dev libxml2-dev libxslt-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir --user -r requirements.txt

# ── Final stage ───────────────────────────────────────────────────────────────
FROM python:3.13-slim AS runtime

WORKDIR /app

# Copy installed packages from builder
COPY --from=builder /root/.local /root/.local

# Copy application code
COPY . .

# Create data directories
RUN mkdir -p data/chroma data/statutes data/amendments

# Non-root user for security
RUN useradd --create-home appuser && chown -R appuser:appuser /app
USER appuser

ENV PATH=/root/.local/bin:$PATH
ENV PYTHONPATH=/app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD python -c "import httpx; httpx.get('http://localhost:8000/health').raise_for_status()" || exit 1

CMD ["python", "-m", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--workers", "2"]
