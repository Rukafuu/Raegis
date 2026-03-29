# Makefile for Raegis Drift Monitor
# Ported from the ML Drift Monitor architecture

.PHONY: all simulate api docker-up clean test

all: simulate api

simulate:
	@echo "[Raegis] Running 12-week drift simulation pipeline..."
	python -m raegis.drift.pipeline

api:
	@echo "[Raegis] Starting FastAPI Drift Monitor on port 8000..."
	python -m raegis.infrastructure.api

docker-up:
	docker-compose -f ../docker-compose.drift.yml up --build

clean:
	rm -rf monitoring_results/
	find . -type d -name "__pycache__" -exec rm -rf {} +

test:
	pytest tests/drift_tests.py
