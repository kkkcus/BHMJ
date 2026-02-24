# ── Stage 1: React 빌드 ──────────────────────────
FROM node:20-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ── Stage 2: Python 서버 ─────────────────────────
FROM python:3.11-slim
WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ ./backend/
COPY --from=frontend /app/dist ./dist

# DB 초기 데이터 삽입 후 서버 시작
CMD python -m backend.seed && \
    python -m uvicorn backend.app:app --host 0.0.0.0 --port ${PORT:-8000}
