"""
Analytics routes: usage statistics and security event history.
"""
import asyncio
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.middleware.auth import get_current_user
from app.models.activity_log import EventType, UserActivityLog
from app.models.protected_file import ProtectedFile
from app.models.security_alert import SecurityAlert
from app.schemas import SecurityEventItem, UsageAnalytics

router = APIRouter()


@router.get("/usage", response_model=UsageAnalytics)
async def usage_analytics(
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    uid = current_user.user_id

    files_q = db.execute(
        select(func.count(ProtectedFile.file_id)).where(ProtectedFile.owner_id == uid)
    )
    bw_q = db.execute(
        select(func.sum(ProtectedFile.size_bytes)).where(ProtectedFile.owner_id == uid)
    )
    events_q = db.execute(
        select(func.count(UserActivityLog.log_id)).where(
            UserActivityLog.user_id == uid,
            UserActivityLog.event_type == EventType.login,
        )
    )
    failed_q = db.execute(
        select(func.count(UserActivityLog.log_id)).where(
            UserActivityLog.user_id == uid,
            UserActivityLog.event_type == EventType.failure,
        )
    )
    recent_q = db.execute(
        select(UserActivityLog)
        .where(UserActivityLog.user_id == uid)
        .order_by(UserActivityLog.timestamp.desc())
        .limit(10)
    )

    files_r, bw_r, events_r, failed_r, recent_r = await asyncio.gather(
        files_q, bw_q, events_q, failed_q, recent_q
    )

    total_files = files_r.scalar() or 0
    total_bytes = bw_r.scalar() or 0
    bandwidth_saved_mb = round(total_bytes / (1024 * 1024), 2)
    total_access_events = events_r.scalar() or 0
    blocked_attempts = failed_r.scalar() or 0
    recent_logs = recent_r.scalars().all()

    recent_events = [
        {
            "id": str(log.log_id),
            "event_type": log.event_type.value,
            "timestamp": log.timestamp.isoformat(),
            "ip_address": log.ip_address,
        }
        for log in recent_logs
    ]

    return UsageAnalytics(
        total_files=total_files,
        total_tokens_issued=total_access_events,
        total_access_events=total_access_events,
        blocked_attempts=blocked_attempts,
        bandwidth_saved_mb=bandwidth_saved_mb,
        recent_events=recent_events,
    )


@router.get("/security-events", response_model=list[SecurityEventItem])
async def security_events(
    limit: int = 20,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    result = await db.execute(
        select(SecurityAlert)
        .where(SecurityAlert.user_id == current_user.user_id)
        .order_by(SecurityAlert.timestamp.desc())
        .limit(limit)
    )
    alerts = result.scalars().all()

    return [
        SecurityEventItem(
            alert_id=str(a.alert_id),
            alert_type=a.alert_type.value,
            description=a.description,
            timestamp=a.timestamp,
            status=a.status.value,
            ip_address=a.ip_address,
        )
        for a in alerts
    ]


from pydantic import BaseModel

class TelemetryEvent(BaseModel):
    event_type: str
    metadata: dict = {}

@router.post("/telemetry", response_model=dict)
async def submit_telemetry(
    event: TelemetryEvent,
    current_user=Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    from app.models.user import User, AccountStatus
    from app.models.security_alert import SecurityAlert, AlertType

    result = await db.execute(select(User).where(User.user_id == current_user.user_id))
    user = result.scalar_one_or_none()
    
    if not user:
        return {"status": "error", "detail": "User not found"}

    score_increment = 0
    alert_threshold = 80
    
    if event.event_type == "rapid_scrubbing":
        score_increment = 10
    elif event.event_type == "copy_attempt":
        score_increment = 20
    elif event.event_type == "dev_tools_opened":
        score_increment = 50

    if score_increment > 0:
        user.risk_score += score_increment
        
        # If threshold crossed, auto-ban
        if user.risk_score >= alert_threshold and user.account_status != AccountStatus.banned:
            user.account_status = AccountStatus.banned
            
            alert = SecurityAlert(
                user_id=user.user_id,
                alert_type=AlertType.banned,
                description=f"Auto-banned due to high risk score ({user.risk_score}): {event.event_type}",
                ip_address=event.metadata.get("ip_address", "unknown")
            )
            db.add(alert)
            
        await db.commit()

    return {"status": "ok", "new_score": user.risk_score, "banned": user.account_status == AccountStatus.banned}
