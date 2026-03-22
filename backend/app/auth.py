import json
import logging
from typing import Optional

import firebase_admin
from fastapi import Depends, Header, HTTPException
from firebase_admin import auth, credentials

from app.config import Settings, get_settings
from app.models import AuthenticatedUser, ErrorResponse

logger = logging.getLogger("chatbot-auth")


def _initialize_firebase(settings: Settings) -> None:
    if firebase_admin._apps:
        return

    cred: Optional[credentials.Base] = None

    if settings.firebase_service_account_json:
        try:
            data = json.loads(settings.firebase_service_account_json)
            cred = credentials.Certificate(data)
        except json.JSONDecodeError as exc:
            raise RuntimeError("Invalid FIREBASE_SERVICE_ACCOUNT_JSON") from exc
    elif settings.firebase_service_account_path:
        cred = credentials.Certificate(settings.firebase_service_account_path)
    else:
        cred = credentials.ApplicationDefault()

    options = {"projectId": settings.firebase_project_id} if settings.firebase_project_id else None
    firebase_admin.initialize_app(cred, options=options)
    logger.info("firebase_admin_initialized")


def get_authenticated_user(
    authorization: Optional[str] = Header(default=None),
    settings: Settings = Depends(get_settings),
) -> AuthenticatedUser:
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail=ErrorResponse(error="Missing or invalid Authorization header", code="UNAUTHORIZED").model_dump(),
        )

    token = authorization.split(" ", 1)[1].strip()
    if not token:
        raise HTTPException(
            status_code=401,
            detail=ErrorResponse(error="Missing authentication token", code="UNAUTHORIZED").model_dump(),
        )

    _initialize_firebase(settings)

    try:
        decoded = auth.verify_id_token(token)
    except Exception:
        raise HTTPException(
            status_code=401,
            detail=ErrorResponse(error="Invalid or expired token", code="TOKEN_INVALID").model_dump(),
        )

    return AuthenticatedUser(
        uid=decoded.get("uid", ""),
        email=decoded.get("email"),
        name=decoded.get("name"),
        picture=decoded.get("picture"),
    )
