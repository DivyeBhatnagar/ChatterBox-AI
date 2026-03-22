from datetime import datetime
from typing import List, Literal, Optional
from uuid import uuid4

from pydantic import BaseModel, Field, field_validator


class ChatMessage(BaseModel):
    role: Literal["system", "user", "assistant"]
    content: str = Field(min_length=1, max_length=8000)
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str = Field(min_length=1, max_length=8000)
    history: List[ChatMessage] = Field(default_factory=list)
    conversation_id: Optional[str] = None
    stream: bool = False
    temperature: Optional[float] = Field(default=None, ge=0, le=2)
    max_tokens: Optional[int] = Field(default=None, ge=64, le=4096)

    @field_validator("message")
    @classmethod
    def message_must_not_be_empty(cls, value: str) -> str:
        if not value.strip():
            raise ValueError("Message cannot be empty")
        return value


class AuthenticatedUser(BaseModel):
    uid: str
    email: Optional[str] = None
    name: Optional[str] = None
    picture: Optional[str] = None


class ChatHistoryItem(BaseModel):
    conversation_id: str
    conversation_title: str
    created_at: datetime
    updated_at: datetime
    is_archived: bool = False
    last_message_preview: str = ""
    message_count: int = 0


class ChatHistoryResponse(BaseModel):
    items: List[ChatHistoryItem]
    total: int


class ConversationLoadResponse(BaseModel):
    conversation_id: str
    conversation_title: str
    is_archived: bool = False
    messages: List[ChatMessage]


class ConversationTitleUpdateRequest(BaseModel):
    conversation_id: str
    conversation_title: str = Field(min_length=1, max_length=120)


class ConversationDeleteRequest(BaseModel):
    conversation_id: str


class ConversationArchiveRequest(BaseModel):
    conversation_id: str
    is_archived: bool


class AuthVerifyResponse(BaseModel):
    uid: str
    email: Optional[str] = None
    valid: bool = True


class ChatUsage(BaseModel):
    prompt_tokens: int = 0
    completion_tokens: int = 0
    total_tokens: int = 0


class ChatResponse(BaseModel):
    conversation_id: str = Field(default_factory=lambda: str(uuid4()))
    response: str
    model: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
    usage: ChatUsage = Field(default_factory=ChatUsage)
    status: Literal["success", "error"] = "success"
    conversation_title: Optional[str] = None


class ErrorResponse(BaseModel):
    error: str
    code: str
    status: Literal["error"] = "error"
