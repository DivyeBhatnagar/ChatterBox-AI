from datetime import datetime, timezone
from typing import List

from firebase_admin import firestore

from app.models import ChatMessage


def _to_epoch_seconds(value: object) -> float:
    if isinstance(value, datetime):
        if value.tzinfo is None:
            return value.replace(tzinfo=timezone.utc).timestamp()
        return value.timestamp()
    return float("-inf")


class FirestoreService:
    def __init__(self) -> None:
        self.db = firestore.client()

    def upsert_user_profile(self, uid: str, email: str | None, name: str | None, picture: str | None, auth_provider: str) -> None:
        ref = self.db.collection("users").document(uid)
        now = datetime.utcnow()
        payload = {
            "uid": uid,
            "email": email,
            "displayName": name,
            "photoURL": picture,
            "lastLoginAt": now,
            "authProvider": auth_provider,
            "preferences": {"theme": "dark", "language": "en"},
        }
        if not ref.get().exists:
            payload["createdAt"] = now
        ref.set(payload, merge=True)

    def ensure_conversation(self, uid: str, conversation_id: str, title: str | None = None) -> str:
        ref = self.db.collection("chatHistories").document(conversation_id)
        snap = ref.get()
        now = datetime.utcnow()
        if not snap.exists:
            ref.set(
                {
                    "userId": uid,
                    "conversationId": conversation_id,
                    "conversationTitle": title or "New Chat",
                    "createdAt": now,
                    "updatedAt": now,
                    "isArchived": False,
                    "tags": [],
                    "pinned": False,
                }
            )
            return title or "New Chat"

        data = snap.to_dict() or {}
        ref.set({"updatedAt": now}, merge=True)
        return data.get("conversationTitle", "New Chat")

    def save_message(self, uid: str, conversation_id: str, role: str, content: str, metadata: dict | None = None) -> None:
        self.db.collection("messages").add(
            {
                "conversationId": conversation_id,
                "userId": uid,
                "role": role,
                "content": content,
                "timestamp": datetime.utcnow(),
                "metadata": metadata or {},
            }
        )

    def update_conversation_title(self, uid: str, conversation_id: str, title: str) -> None:
        ref = self.db.collection("chatHistories").document(conversation_id)
        snap = ref.get()
        if not snap.exists:
            raise ValueError("Conversation not found")
        data = snap.to_dict() or {}
        if data.get("userId") != uid:
            raise PermissionError("Not allowed")
        ref.set({"conversationTitle": title, "updatedAt": datetime.utcnow()}, merge=True)

    def archive_conversation(self, uid: str, conversation_id: str, is_archived: bool) -> None:
        ref = self.db.collection("chatHistories").document(conversation_id)
        snap = ref.get()
        if not snap.exists:
            raise ValueError("Conversation not found")
        data = snap.to_dict() or {}
        if data.get("userId") != uid:
            raise PermissionError("Not allowed")
        ref.set({"isArchived": is_archived, "updatedAt": datetime.utcnow()}, merge=True)

    def delete_conversation(self, uid: str, conversation_id: str) -> None:
        ref = self.db.collection("chatHistories").document(conversation_id)
        snap = ref.get()
        if not snap.exists:
            return
        data = snap.to_dict() or {}
        if data.get("userId") != uid:
            raise PermissionError("Not allowed")

        docs = self.db.collection("messages").where("conversationId", "==", conversation_id).stream()
        batch = self.db.batch()
        for doc in docs:
            batch.delete(doc.reference)
        batch.delete(ref)
        batch.commit()

    def get_history(self, uid: str, include_archived: bool, limit: int = 50, search: str = "") -> list[dict]:
        query = self.db.collection("chatHistories").where("userId", "==", uid)
        rows = []
        candidates: list[dict] = []

        for doc in query.stream():
            data = doc.to_dict() or {}
            if not include_archived and data.get("isArchived", False):
                continue
            if search and search.lower() not in str(data.get("conversationTitle", "")).lower():
                continue

            candidates.append({"id": doc.id, "data": data})

        candidates.sort(
            key=lambda item: _to_epoch_seconds(item["data"].get("updatedAt")),
            reverse=True,
        )

        for item in candidates[:limit]:
            doc_id = item["id"]
            data = item["data"]

            preview = ""
            count = 0
            latest_message_content = ""
            latest_message_ts = float("-inf")

            msg_query = self.db.collection("messages").where("conversationId", "==", data.get("conversationId", doc_id))
            for mdoc in msg_query.stream():
                count += 1
                mdata = mdoc.to_dict() or {}
                ts = mdata.get("timestamp")
                ts_value = _to_epoch_seconds(ts)
                if ts_value >= latest_message_ts:
                    latest_message_ts = ts_value
                    latest_message_content = str(mdata.get("content", ""))

            preview = latest_message_content[:140]

            rows.append(
                {
                    "conversation_id": data.get("conversationId", doc_id),
                    "conversation_title": data.get("conversationTitle", "New Chat"),
                    "created_at": data.get("createdAt") or datetime.utcnow(),
                    "updated_at": data.get("updatedAt") or datetime.utcnow(),
                    "is_archived": data.get("isArchived", False),
                    "last_message_preview": preview,
                    "message_count": count,
                }
            )
        return rows

    def get_conversation_messages(self, uid: str, conversation_id: str) -> tuple[str, bool, List[ChatMessage]]:
        ref = self.db.collection("chatHistories").document(conversation_id)
        snap = ref.get()
        if not snap.exists:
            raise ValueError("Conversation not found")
        data = snap.to_dict() or {}
        if data.get("userId") != uid:
            raise PermissionError("Not allowed")

        title = data.get("conversationTitle", "New Chat")
        is_archived = data.get("isArchived", False)

        query = self.db.collection("messages").where("conversationId", "==", conversation_id)
        raw_messages: list[dict] = []
        for doc in query.stream():
            raw_messages.append(doc.to_dict() or {})

        raw_messages.sort(
            key=lambda m: _to_epoch_seconds(m.get("timestamp")),
        )

        messages: list[ChatMessage] = []
        for m in raw_messages:
            ts = m.get("timestamp")
            messages.append(
                ChatMessage(
                    role=m.get("role", "assistant"),
                    content=m.get("content", ""),
                    timestamp=ts if isinstance(ts, datetime) else datetime.utcnow(),
                )
            )
        return title, is_archived, messages
