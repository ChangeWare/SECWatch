from typing import Optional, List
from fastapi import FastAPI, HTTPException, Request, Depends
from celery.result import AsyncResult
from datetime import datetime, timezone
import redis
from fastapi.security import HTTPBasicCredentials, HTTPBasic
from celery_app import celery_app
from sec_miner.api_types import CIKsRequest
from tasks.company import process_companies_concepts, \
    process_companies_filings, process_new_companies
from tasks.maintenance import process_index, process_historical_indices
from tasks.monitoring import check_new_filings, check_company_updates
import uvicorn
from sec_miner.utils.logger_factory import get_logger
from sec_miner.config.loader import config


security = HTTPBasic()

def verify_credentials(credentials: HTTPBasicCredentials = Depends(security)):
    if credentials.username != config.API_USER or credentials.password != config.API_PASS:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
        )
    return credentials.username

app = FastAPI(title="SEC Miner API", dependencies=[Depends(verify_credentials)])
redis_client = redis.from_url(config.REDIS_URL)
logger = get_logger(__name__)


@app.get("/health")
async def health_check():
    """Health check endpoint for container orchestration"""
    try:
        # Check Redis connection
        redis_client.ping()

        # Check Celery/RabbitMQ connection
        celery_app.control.inspect().active()

        return {"status": "healthy", "timestamp": datetime.now(timezone.utc)}
    except Exception as e:
        raise HTTPException(status_code=503, detail=str(e))


@app.get("/monitoring/trigger-monitoring-refresh")
async def trigger_monitoring_refresh():
    """Trigger monitoring refresh"""
    try:
        tasks = [check_new_filings.delay(),
                 check_company_updates.delay()]
        return {
            "task_ids": [t.id for t in tasks],
        }
    except Exception as e:
        logger.error(f"Error triggering monitoring refresh: {str(e)}")


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


@app.post("/tasks/process-companies")
async def trigger_update_companies():
    """Manually trigger company list update"""
    try:
        task = process_new_companies.delay()
        return {
            "task_id": task.id,
            "status": "started",
            "check_status_url": f"/tasks/{task.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/tasks/process-index")
async def trigger_update_companies():
    """Manually trigger SEC index update"""
    try:
        task = process_index.delay()
        return {
            "task_id": task.id,
            "status": "started",
            "check_status_url": f"/tasks/{task.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/tasks/process-historical-indices")
async def trigger_update_companies():
    """Manually trigger SEC index update"""
    try:
        task = process_historical_indices.delay()
        return {
            "task_id": task.id,
            "status": "started",
            "check_status_url": f"/tasks/{task.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/tasks/trigger_company_concepts_processing")
async def trigger_company_concepts_processing(
    request: CIKsRequest,
):
    """Manually trigger company list update"""
    try:
        ciks = request.ciks
        task = process_companies_concepts.delay(ciks, len(ciks) == 0, request.retry_last_run)

        return {
            "task_id": task.id,
            "status": "started",
            "check_status_url": f"/tasks/{task.id}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/tasks/trigger_company_filings_processing")
async def trigger_company_filings_processing(
        request: CIKsRequest,
):
    """Manually trigger company list update"""
    try:
        ciks = request.ciks
        task = process_companies_filings.delay(ciks, len(ciks) == 0, request.retry_last_run)

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
