from fastapi import FastAPI, Request
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from prometheus_fastapi_instrumentator import Instrumentator
from backend.routers import users, resources, analytics

limiter = Limiter(key_func=get_remote_address)

app = FastAPI(
    title="Multi-Cloud Cost Intelligence Platform",
    description="Enterprise API for cloud cost analysis",
    version="0.1.0"
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

Instrumentator().instrument(app).expose(app)

app.include_router(users.router)
app.include_router(resources.router)
app.include_router(analytics.router)

@app.get("/")
@limiter.limit("60/minute")
def root(request: Request):
    return {"message": "Cost Intelligence Platform API", "status": "running", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
