import threading
import time
from collections import defaultdict, deque
from typing import Deque, Dict


class InMemoryRateLimiter:
    def __init__(self, limit: int, window_seconds: int) -> None:
        self.limit = limit
        self.window_seconds = window_seconds
        self._requests: Dict[str, Deque[float]] = defaultdict(deque)
        self._lock = threading.Lock()

    def allow(self, key: str) -> bool:
        now = time.time()
        with self._lock:
            queue = self._requests[key]

            while queue and now - queue[0] > self.window_seconds:
                queue.popleft()

            if len(queue) >= self.limit:
                return False

            queue.append(now)
            return True
