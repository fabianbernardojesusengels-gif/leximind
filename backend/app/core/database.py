import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# SQLite for local/MVP — swap DATABASE_URL env var for Postgres (Neon/Supabase)
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./leximind.db")

# Fix for SQLite threading + handle Postgres URL from Railway/Render
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
else:
    # Supabase/Neon sends postgresql:// — SQLAlchemy needs postgresql+psycopg2://
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
