from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.core.security import hash_password, verify_password, create_access_token, get_current_user
from app.models.user import User
from app.schemas.schemas import UserRegister, UserLogin, TokenResponse, UserProfile
from app.models.word import UserProgress, LearningStatus

router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(data: UserRegister, db: Session = Depends(get_db)):
    if db.query(User).filter(User.username == data.username).first():
        raise HTTPException(status_code=400, detail="Username already taken")
    if data.email and db.query(User).filter(User.email == data.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")

    user = User(
        username=data.username,
        email=data.email,
        hashed_password=hash_password(data.password)
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, user_id=user.id, username=user.username)

@router.post("/login", response_model=TokenResponse)
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == data.username).first()
    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"sub": user.id})
    return TokenResponse(access_token=token, user_id=user.id, username=user.username)

@router.get("/me", response_model=UserProfile)
def get_me(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    progress_list = db.query(UserProgress).filter(UserProgress.user_id == current_user.id).all()
    known = sum(1 for p in progress_list if p.status == LearningStatus.known)
    learning = sum(1 for p in progress_list if p.status == LearningStatus.learning)
    unknown = sum(1 for p in progress_list if p.status == LearningStatus.unknown)

    return UserProfile(
        id=current_user.id,
        username=current_user.username,
        email=current_user.email,
        streak_days=current_user.streak_days,
        created_at=current_user.created_at,
        words_known=known,
        words_learning=learning,
        words_unknown=unknown
    )
