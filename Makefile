# LexiMind — Developer Commands
# Usage: make <command>

.PHONY: help dev-backend dev-frontend seed install-backend install-frontend

help:
	@echo ""
	@echo "  LexiMind Dev Commands"
	@echo "  ─────────────────────────────────"
	@echo "  make install       → Install all dependencies"
	@echo "  make dev           → Run backend + frontend together"
	@echo "  make dev-backend   → Run FastAPI backend only"
	@echo "  make dev-frontend  → Run Next.js frontend only"
	@echo "  make seed          → Seed initial words into DB"
	@echo "  make docs          → Open API docs in browser"
	@echo ""

install: install-backend install-frontend

install-backend:
	cd backend && python -m venv venv && \
	. venv/bin/activate && \
	pip install -r requirements.txt
	@echo "✅ Backend dependencies installed"

install-frontend:
	cd frontend && npm install
	@echo "✅ Frontend dependencies installed"

dev-backend:
	cd backend && . venv/bin/activate && \
	uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && npm run dev

dev:
	@echo "Starting LexiMind dev servers..."
	@make dev-backend &
	@make dev-frontend

seed:
	curl -s http://localhost:8000/api/words/seed | python3 -m json.tool
	@echo "✅ Words seeded!"

docs:
	open http://localhost:8000/docs || xdg-open http://localhost:8000/docs

env-setup:
	cp backend/.env.example backend/.env
	cp frontend/.env.example frontend/.env.local
	@echo "✅ .env files created — edit them with your values"
