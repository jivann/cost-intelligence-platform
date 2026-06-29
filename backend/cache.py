import redis
import json
import os
from dotenv import load_dotenv

load_dotenv()

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379")

redis_client = redis.from_url(REDIS_URL, decode_responses=True)

def get_cached(key: str):
    try:
        data = redis_client.get(key)
        if data:
            return json.loads(data)
        return None
    except Exception:
        return None

def set_cached(key: str, value: dict, ttl: int = 300):
    try:
        redis_client.setex(key, ttl, json.dumps(value))
    except Exception:
        pass

def delete_cached(key: str):
    try:
        redis_client.delete(key)
    except Exception:
        pass

def delete_pattern(pattern: str):
    try:
        keys = redis_client.keys(pattern)
        if keys:
            redis_client.delete(*keys)
    except Exception:
        pass
