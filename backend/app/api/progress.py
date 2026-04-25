from datetime import datetime, timedelta
from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import get_current_user
from app.models.word import UserProgress, LearningStatus
from app.models.user import User
from app.schemas.schemas import ProgressUpdate, ProgressOut, DailyStats

router = APIRouter()

def calculate_srs(prog: UserProgress, status: LearningStatus) -> UserProgress:
    """Simple SM-2 inspired SRS algorithm."""
    now = datetime.utcnow()
    prog.last_reviewed = now
    prog.review_count += 1

    if status == LearningStatus.known:
        prog.ease_factor = min(prog.ease_factor + 0.1, 3.0)
        prog.interval_days = max(1, int(prog.interval_days * prog.ease_factor))
    elif status == LearningStatus.learning:
        prog.ease_factor = max(prog.ease_factor - 0.05, 1.3)
        prog.interval_days = max(1, prog.interval_days // 2)
    else:  # unknown — reset
        prog.ease_factor = max(prog.ease_factor - 0.2, 1.3)
        prog.interval_days = 1

    prog.next_review = now + timedelta(days=prog.interval_days)
    prog.status = status
    return prog

def update_streak(user: User, db: Session):
    now = datetime.utcnow()
    if user.last_activity:
        diff = (now.date() - user.last_activity.date()).days
        if diff == 1:
            user.streak_days += 1
        elif diff > 1:
            user.streak_days = 1
    else:
        user.streak_days = 1
    user.last_activity = now
    db.commit()

@router.post("/update", response_model=ProgressOut)
def update_progress(
    data: ProgressUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    prog = db.query(UserProgress).filter(
        UserProgress.user_id == current_user.id,
        UserProgress.word_id == data.word_id
    ).first()

    if not prog:
        prog = UserProgress(user_id=current_user.id, word_id=data.word_id)
        db.add(prog)

    prog = calculate_srs(prog, data.status)
    update_streak(current_user, db)
    db.commit()
    db.refresh(prog)
    return prog

@router.get("/stats", response_model=DailyStats)
def get_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    progress_list = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    total = len(progress_list)
    known = sum(1 for p in progress_list if p.status == LearningStatus.known)
    learning = sum(1 for p in progress_list if p.status == LearningStatus.learning)
    unknown = sum(1 for p in progress_list if p.status == LearningStatus.unknown)
    total_reviewed = sum(p.review_count for p in progress_list)
    mastery = (known / total * 100) if total > 0 else 0.0

    return DailyStats(
        words_known=known,
        words_learning=learning,
        words_unknown=unknown,
        total_reviewed=total_reviewed,
        streak_days=current_user.streak_days,
        mastery_percentage=round(mastery, 1)
    )

@router.get("/all", response_model=List[ProgressOut])
def get_all_progress(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
