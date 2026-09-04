from pydantic import BaseModel, EmailStr
from typing import List, Optional
from sqlalchemy import Column, String, Boolean
from database import Base

# SQLAlchemy Models
class DBUser(Base):
    __tablename__ = "users"
    username = Column(String, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=True)
    full_name = Column(String, nullable=True)
    hashed_password = Column(String, nullable=False)
    disabled = Column(Boolean, default=False)
    role = Column(String, nullable=False)

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str
    role: str

class TokenData(BaseModel):
    username: str | None = None
    role: str | None = None

class UserBase(BaseModel):
    username: str
    email: EmailStr | None = None
    full_name: str | None = None
    disabled: bool | None = None
    role: str

class User(UserBase):
    pass
    class Config:
        orm_mode = True

class UserInDB(UserBase):
    hashed_password: str

# Pydantic Schemas for AI Analysis
class SentenceSentiment(BaseModel):
    time: str = ""
    speaker: str = ""
    statement: str = ""
    sentiment: str = ""
    confidence: int = 0

class KPI(BaseModel):
    name: str = ""
    value: str = ""

class NameValue(BaseModel):
    name: str = ""
    value: int = 0

class EmotionScore(BaseModel):
    emotion: str = ""
    score: int = 0

class EmotionTimeline(BaseModel):
    time: str = ""
    emotion: str = ""
    val: int = 0

class AgentCategory(BaseModel):
    category: str = ""
    score: int = 0

class AgentScore(BaseModel):
    overall: int = 0
    categories: List[AgentCategory] = []

class ActionItem(BaseModel):
    action: str = ""
    owner: str = ""
    status: str = ""

class Entity(BaseModel):
    key: str = ""
    value: str = ""

class AnalysisResult(BaseModel):
    overall_sentiment: str = ""
    confidence: int = 0
    overall_reasoning: str = ""
    sentiment_breakdown: List[NameValue] = []
    sentence_level: List[SentenceSentiment] = []
    emotions: List[EmotionScore] = []
    emotion_journey: List[EmotionTimeline] = []
    summary: str = ""
    kpis: List[KPI] = []
    agent_score: Optional[AgentScore] = None
    action_items: List[ActionItem] = []
    entities: List[Entity] = []

class TextPayload(BaseModel):
    text: str
