# api.py
from fastapi import FastAPI, HTTPException, BackgroundTasks
from celery.result import AsyncResult
from datetime import datetime
import redis
from celery_app import celery_app
from tasks.company import update_company_list
from config import Config
import uvicorn
from sec_miner.utils.logger_factory import get_logger

app = FastAPI(title="SEC Miner API")
redis_client = redis.from_url(Config.REDIS_URL)
logger = get_logger(__name__)


@app.get("/health")
async def health_check():
    """Health check endpoint for container orchestration"""
    try:
        # Check Redis connection
        redis_client.ping()

        # Check Celery/RabbitMQ connection
        celery_app.control.inspect().active()

        return {"status": "healthy", "timestamp": datetime.utcnow()}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.get("/metrics")
async def get_metrics():
    """Expose metrics for monitoring"""
    try:
        metrics = {
            "requests_today": int(redis_client.get("sec_api_requests_today") or 0),
            "active_workers": len(celery_app.control.inspect().active() or {}),
            "cached_filings": len(redis_client.keys("filing:*")),
            "last_company_update": redis_client.get("last_company_update")
        }
        return metrics
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/tasks/update-companies")
async def trigger_company_update(background_tasks: BackgroundTasks):
    """Manually trigger company list update"""
    try:
        task = update_company_list.delay()
        return {
            "task_id": task.id,
            "status": "started",
            "check_status_url": f"/tasks/{task.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/tasks/{task_id}")
async def get_task_status(task_id: str):
    """Check status of a specific task"""
    result = AsyncResult(task_id, app=celery_app)
    return {
        "task_id": task_id,
        "status": result.status,
        "result": result.result if result.ready() else None
    }


@app.get("/companies/last-update")
async def get_last_update():
    """Get information about the last company list update"""
    last_update = redis_client.get("last_company_update")
    return {
        "last_update": last_update.decode() if last_update else None,
        "company_count": len(redis_client.keys("company:*"))
    }

if __name__ == "__main__":
    logger.info("Starting SEC Miner API in debug mode...")
    uvicorn.run(
        "sec_miner.api:app",
        host="0.0.0.0",
        port=8000,
        reload=True,  # Enable auto-reload during development
        log_level="debug"
    )