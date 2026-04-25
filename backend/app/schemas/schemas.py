from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from app.models.word import DifficultyLevel, WordCategory, LearningStatus

# ─── Auth ─────────────────────────────────────────────
class UserRegister(BaseModel):
    username: str
    password: str
    email: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: int
    username: str

# ─── User ─────────────────────────────────────────────
class UserProfile(BaseModel):
    id: int
    username: str
    email: Optional[str]
    streak_days: int
    created_at: datetime
    words_known: int = 0
    words_learning: int = 0
    words_unknown: int = 0

    class Config:
        from_attributes = True

# ─── Words ────────────────────────────────────────────
class WordBase(BaseModel):
    word: str
    slug: str
    simple_definition: str
    advanced_definition: str
    category: WordCategory
    difficulty: DifficultyLevel
    examples: Optional[str] = None
    etymology: Optional[str] = None
    related_words: Optional[str] = None
    phonetic: Optional[str] = None

class WordCreate(WordBase):
    pass

class WordOut(WordBase):
    id: int
    created_at: datetime

    class Config:
        from_attributes = True

class WordWithProgress(WordOut):
    user_status: Optional[LearningStatus] = None

# ─── Progress ─────────────────────────────────────────
class ProgressUpdate(BaseModel):
    word_id: int
    status: LearningStatus

class ProgressOut(BaseModel):
    id: int
    word_id: int
    status: LearningStatus
    review_count: int
    ease_factor: float
    interval_days: int
    next_review: Optional[datetime]
    last_reviewed: Optional[datetime]

    class Config:
        from_attributes = True

class DailyStats(BaseModel):
    words_known: int
    words_learning: int
    words_unknown: int
    total_reviewed: int
    streak_days: int
    mastery_percentage: float

# ─── AI ───────────────────────────────────────────────
class AIExplainRequest(BaseModel):
    word: str
    context: Optional[str] = None
    level: Optional[str] = "intermediate"

class AIExplainResponse(BaseModel):
    word: str
    explanation: str
    analogy: str
    example: str
    related_concepts: List[str]
    is_mock: bool = False
