# order-service: the SPOC order automation behind an authenticated HTTP API.
# Before building, copy att_order_automation.py (from the "attspoc AT&T" folder) next to this file.
# The partner link is NOT baked in: pass ATTSPOC_URL as a secret at run time.
FROM mcr.microsoft.com/playwright/python:v1.60.0-noble

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py att_order_automation.py ./

# Private run-time folders (screenshots, specialist queue). Mount a volume here to keep them.
RUN mkdir -p /data/order_artifacts /data/specialist_queue && chown -R pwuser:pwuser /data
ENV ATTSPOC_ARTIFACT_DIR=/data/order_artifacts \
    ATTSPOC_SPECIALIST_QUEUE_DIR=/data/specialist_queue \
    ATTSPOC_HEADLESS=1 \
    PORT=8080 \
    PYTHONUNBUFFERED=1
USER pwuser
EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s CMD python -c "import urllib.request,os; urllib.request.urlopen(f'http://127.0.0.1:{os.environ[\"PORT\"]}/healthz', timeout=4)"
CMD ["python", "server.py"]
