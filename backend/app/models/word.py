from sqlalchemy import Column, Integer, String, Text, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import enum
from app.core.database import Base

class DifficultyLevel(str, enum.Enum):
    beginner = "beginner"
    intermediate = "intermediate"
    advanced = "advanced"
    expert = "expert"

class WordCategory(str, enum.Enum):
    science = "science"
    philosophy = "philosophy"
    language = "language"
    mathematics = "mathematics"
    technology = "technology"
    arts = "arts"
    history = "history"
    psychology = "psychology"
    economics = "economics"
    general = "general"

class Word(Base):
    __tablename__ = "words"

    id = Column(Integer, primary_key=True, index=True)
    slug = Column(String(100), unique=True, index=True, nullable=False)  # SEO slug: /word/entropia
    word = Column(String(100), nullable=False, index=True)
    simple_definition = Column(Text, nullable=False)
    advanced_definition = Column(Text, nullable=False)
    category = Column(Enum(WordCategory), default=WordCategory.general)
    difficulty = Column(Enum(DifficultyLevel), default=DifficultyLevel.intermediate)
    examples = Column(Text, nullable=True)  # JSON array as string
    etymology = Column(Text, nullable=True)
    related_words = Column(Text, nullable=True)  # JSON array
    phonetic = Column(String(100), nullable=True)
    created_at = Column(DateTime, server_default=func.now())

    user_progress = relationship("UserProgress", back_populates="word", cascade="all, delete-orphan")

class LearningStatus(str, enum.Enum):
    unknown = "unknown"
    learning = "learning"
    known = "known"

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    word_id = Column(Integer, ForeignKey("words.id"), nullable=False)
    status = Column(Enum(LearningStatus), default=LearningStatus.unknown)
    review_count = Column(Integer, default=0)
    ease_factor = Column(Float, default=2.5)  # SRS ease factor
    interval_days = Column(Integer, default=1)  # SRS interval
    next_review = Column(DateTime, nullable=True)
    last_reviewed = Column(DateTime, nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

    user = relationship("User", back_populates="progress")
    word = relationship("Word", back_populates="user_progress")
