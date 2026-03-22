import logging
import time
from datetime import datetime
from uuid import uuid4

from fastapi import Depends, FastAPI, HTTPException, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from openai import APIConnectionError, APIError, AuthenticationError, RateLimitError

from app.auth import get_authenticated_user
from app.config import get_settings
from app.models import (
    AuthVerifyResponse,
    ChatHistoryResponse,
    ChatRequest,
    ChatResponse,
    ConversationArchiveRequest,
    ConversationDeleteRequest,
    ConversationLoadResponse,
    ConversationTitleUpdateRequest,
    ErrorResponse,
)
from app.rate_limit import InMemoryRateLimiter
from app.services.firestore_service import FirestoreService
from app.services.openai_client import OpenAIChatService, sanitize_text

settings = get_settings()

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("chatbot-api")

app = FastAPI(title="AI Chatbot API", version="2.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins or ["*"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)

ip_rate_limiter = InMemoryRateLimiter(
    limit=settings.rate_limit_requests,
    window_seconds=settings.rate_limit_window_seconds,
)

chat_service = OpenAIChatService(settings=settings)
firestore_service: FirestoreService | None = None


def get_firestore_service() -> FirestoreService:
    global firestore_service
    if firestore_service is None:
        firestore_service = FirestoreService()
    return firestore_service


@app.get("/health")
def health_check() -> dict:
    return {
        "status": "ok",
        "timestamp": datetime.utcnow().isoformat(),
        "environment": settings.app_env,
        "model": settings.openai_model,
    }


@app.exception_handler(HTTPException)
async def http_exception_handler(_: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    payload = ErrorResponse(error=str(exc.detail), code="HTTP_ERROR").model_dump()
    return JSONResponse(status_code=exc.status_code, content=payload)


@app.get("/auth/verify", response_model=AuthVerifyResponse)
def verify_auth(user=Depends(get_authenticated_user)):
    return AuthVerifyResponse(uid=user.uid, email=user.email, valid=True)


@app.get("/chat/history", response_model=ChatHistoryResponse)
def get_chat_history(
    include_archived: bool = Query(default=False),
    limit: int = Query(default=50, ge=1, le=200),
    search: str = Query(default=""),
    user=Depends(get_authenticated_user),
):
    service = get_firestore_service()
    items = service.get_history(user.uid, include_archived=include_archived, limit=limit, search=search)
    return ChatHistoryResponse(items=items, total=len(items))


@app.get("/chat/load", response_model=ConversationLoadResponse)
def load_conversation(conversation_id: str = Query(...), user=Depends(get_authenticated_user)):
    service = get_firestore_service()
    try:
        title, is_archived, messages = service.get_conversation_messages(user.uid, conversation_id)
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(error="Conversation not found", code="NOT_FOUND").model_dump(),
        )
    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail=ErrorResponse(error="Not allowed to access this conversation", code="FORBIDDEN").model_dump(),
        )

    return ConversationLoadResponse(
        conversation_id=conversation_id,
        conversation_title=title,
        is_archived=is_archived,
        messages=messages,
    )


@app.patch("/chat/title")
def update_title(payload: ConversationTitleUpdateRequest, user=Depends(get_authenticated_user)):
    service = get_firestore_service()
    try:
        service.update_conversation_title(user.uid, payload.conversation_id, payload.conversation_title.strip())
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(error="Conversation not found", code="NOT_FOUND").model_dump(),
        )
    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail=ErrorResponse(error="Not allowed to modify this conversation", code="FORBIDDEN").model_dump(),
        )
    return {"status": "success"}


@app.patch("/chat/archive")
def archive_conversation(payload: ConversationArchiveRequest, user=Depends(get_authenticated_user)):
    service = get_firestore_service()
    try:
        service.archive_conversation(user.uid, payload.conversation_id, payload.is_archived)
    except ValueError:
        raise HTTPException(
            status_code=404,
            detail=ErrorResponse(error="Conversation not found", code="NOT_FOUND").model_dump(),
        )
    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail=ErrorResponse(error="Not allowed to modify this conversation", code="FORBIDDEN").model_dump(),
        )
    return {"status": "success"}


@app.delete("/chat/delete")
def delete_conversation(payload: ConversationDeleteRequest, user=Depends(get_authenticated_user)):
    service = get_firestore_service()
    try:
        service.delete_conversation(user.uid, payload.conversation_id)
    except PermissionError:
        raise HTTPException(
            status_code=403,
            detail=ErrorResponse(error="Not allowed to delete this conversation", code="FORBIDDEN").model_dump(),
        )
    return {"status": "success"}


@app.post(
    "/chat",
    response_model=ChatResponse,
    responses={
        400: {"model": ErrorResponse},
        401: {"model": ErrorResponse},
        429: {"model": ErrorResponse},
        500: {"model": ErrorResponse},
        503: {"model": ErrorResponse},
    },
)
async def chat(request: Request, payload: ChatRequest, user=Depends(get_authenticated_user)):
    service = get_firestore_service()
    service.upsert_user_profile(
        uid=user.uid,
        email=user.email,
        name=user.name,
        picture=user.picture,
        auth_provider="google" if user.picture else "email",
    )

    client_ip = request.client.host if request.client else "unknown"
    rate_key = f"{user.uid}:{client_ip}"
    if not ip_rate_limiter.allow(rate_key):
        raise HTTPException(
            status_code=429,
            detail=ErrorResponse(
                error="Too many requests. Please wait and try again.",
                code="RATE_LIMIT_EXCEEDED",
            ).model_dump(),
        )

    sanitized_message = sanitize_text(payload.message, settings.max_input_chars)
    if not sanitized_message:
        raise HTTPException(
            status_code=400,
            detail=ErrorResponse(error="Message is empty after sanitization.", code="INVALID_INPUT").model_dump(),
        )

    conversation_id = payload.conversation_id or str(uuid4())
    title = service.ensure_conversation(user.uid, conversation_id)

    start_time = time.perf_counter()

    try:
        response_text, usage = chat_service.generate_response(
            user_message=sanitized_message,
            history=payload.history,
            temperature=payload.temperature if payload.temperature is not None else settings.default_temperature,
            max_tokens=payload.max_tokens if payload.max_tokens is not None else settings.default_max_tokens,
        )
    except AuthenticationError:
        logger.exception("Authentication error from model provider")
        raise HTTPException(
            status_code=401,
            detail=ErrorResponse(error="Model provider authentication failed.", code="AUTHENTICATION_ERROR").model_dump(),
        )
    except RateLimitError:
        logger.exception("Rate limit reached at model provider")
        raise HTTPException(
            status_code=429,
            detail=ErrorResponse(error="Model provider is rate limiting requests.", code="UPSTREAM_RATE_LIMIT").model_dump(),
        )
    except (APIConnectionError, APIError):
        logger.exception("Upstream model error")
        raise HTTPException(
            status_code=503,
            detail=ErrorResponse(error="Temporary model service issue. Please try again.", code="UPSTREAM_ERROR").model_dump(),
        )
    except Exception:
        logger.exception("Unexpected server error")
        raise HTTPException(
            status_code=500,
            detail=ErrorResponse(error="Unexpected server error.", code="INTERNAL_ERROR").model_dump(),
        )

    response_ms = round((time.perf_counter() - start_time) * 1000, 2)
    service.save_message(user.uid, conversation_id, "user", sanitized_message)
    service.save_message(
        user.uid,
        conversation_id,
        "assistant",
        response_text,
        metadata={"usage": usage, "responseMs": response_ms, "model": settings.openai_model},
    )
    service.ensure_conversation(user.uid, conversation_id)

    logger.info("chat_request_success user_id=%s conversation_id=%s ip=%s", user.uid, conversation_id, client_ip)

    return ChatResponse(
        conversation_id=conversation_id,
        response=response_text,
        model=settings.openai_model,
        usage=usage,
        conversation_title=title,
    )
