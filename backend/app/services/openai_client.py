import re
from typing import List

from openai import APIConnectionError, APIError, OpenAI, RateLimitError
from tenacity import retry, retry_if_exception_type, stop_after_attempt, wait_exponential

from app.config import Settings
from app.models import ChatMessage

SYSTEM_PROMPT = (
    "You are a professional, intelligent AI assistant designed to help users with a wide range "
    "of tasks. You provide clear, concise, and accurate responses. You are helpful, harmless, and "
    "honest. You explain complex concepts in an understandable way. You ask clarifying questions "
    "when needed. You acknowledge limitations and uncertainties. You maintain a professional yet "
    "approachable tone."
)


CONTROL_CHARS_RE = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def sanitize_text(value: str, max_chars: int) -> str:
    cleaned = CONTROL_CHARS_RE.sub("", value).strip()
    if len(cleaned) > max_chars:
        return cleaned[:max_chars]
    return cleaned


class OpenAIChatService:
    def __init__(self, settings: Settings) -> None:
        self.settings = settings
        self.client = OpenAI(
            api_key=settings.openai_api_key,
            base_url=settings.openai_base_url,
            timeout=settings.request_timeout_seconds,
        )

    def build_messages(self, user_message: str, history: List[ChatMessage]) -> list[dict[str, str]]:
        messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]

        for item in history[-20:]:
            if item.role in {"user", "assistant"} and item.content.strip():
                messages.append({"role": item.role, "content": item.content.strip()})

        messages.append({"role": "user", "content": user_message})
        return messages

    @retry(
        retry=retry_if_exception_type((APIError, APIConnectionError)),
        wait=wait_exponential(multiplier=1, min=1, max=8),
        stop=stop_after_attempt(3),
        reraise=True,
    )
    def generate_response(
        self,
        user_message: str,
        history: List[ChatMessage],
        temperature: float,
        max_tokens: int,
    ) -> tuple[str, dict]:
        messages = self.build_messages(user_message=user_message, history=history)

        completion = self.client.chat.completions.create(
            model=self.settings.openai_model,
            messages=messages,
            temperature=temperature,
            top_p=1,
            max_tokens=max_tokens,
            stream=False,
        )

        content = completion.choices[0].message.content or ""
        usage = {
            "prompt_tokens": completion.usage.prompt_tokens if completion.usage else 0,
            "completion_tokens": completion.usage.completion_tokens if completion.usage else 0,
            "total_tokens": completion.usage.total_tokens if completion.usage else 0,
        }
        return content.strip(), usage


RETRIABLE_EXCEPTIONS = (APIConnectionError, APIError, RateLimitError)
