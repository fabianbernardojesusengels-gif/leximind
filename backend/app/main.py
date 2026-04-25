from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import auth, words, progress, ai
from app.core.database import engine, Base

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LexiMind API",
    description="Intelligent vocabulary learning platform",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In prod: set to your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(words.router, prefix="/api/words", tags=["words"])
app.include_router(progress.router, prefix="/api/progress", tags=["progress"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
def root():
    return {"message": "LexiMind API", "status": "running", "version": "1.0.0"}

@app.get("/health")
def health():
    return {"status": "ok"}
