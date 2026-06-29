from fastapi import FastAPI

app = FastAPI(
    title="Multi-Cloud Cost Intelligence Platform",
    description="Enterprise API for cloud cost analysis",
    version="0.1.0"
)

@app.get("/")
def root():
    return {"message": "Cost Intelligence Platform API", "status": "running", "version": "0.1.0"}

@app.get("/health")
def health():
    return {"status": "healthy"}
