FROM python:3.9-slim

WORKDIR /app

# System dependencies for scientific libs
RUN apt-get update && apt-get install -y \
    build-essential \
    curl \
    software-properties-common \
    && rm -rf /var/lib/apt/lists/*

# Copy and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the core logic and main server
COPY raegis/ raegis/
COPY main.py .
COPY schemas.py .

# Environment variables
ENV RAEGIS_API_KEY="raegis-default-secret-key-1337"
EXPOSE 8000

# Start the uvicorn server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
