"""
Analytics routes: usage statistics and security event history.
"""
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
    # Total protected files
    files_result = await db.execute(
        select(func.count(ProtectedFile.file_id)).where(
            ProtectedFile.owner_id == current_user.user_id
        )
    )
    total_files = files_result.scalar() or 0

    # Total bandwidth saved (sum of file sizes in MB)
    bw_result = await db.execute(
        select(func.sum(ProtectedFile.size_bytes)).where(
            ProtectedFile.owner_id == current_user.user_id
        )
    )
    total_bytes = bw_result.scalar() or 0
    bandwidth_saved_mb = round(total_bytes / (1024 * 1024), 2)

    # Activity events for this user
    events_result = await db.execute(
        select(func.count(UserActivityLog.log_id)).where(
            UserActivityLog.user_id == current_user.user_id,
            UserActivityLog.event_type == EventType.login,
        )
    )
    total_access_events = events_result.scalar() or 0

    # Failed attempts
    failed_result = await db.execute(
        select(func.count(UserActivityLog.log_id)).where(
            UserActivityLog.user_id == current_user.user_id,
            UserActivityLog.event_type == EventType.failure,
        )
    )
    blocked_attempts = failed_result.scalar() or 0

    # Recent activity logs (last 10)
    recent_result = await db.execute(
        select(UserActivityLog)
        .where(UserActivityLog.user_id == current_user.user_id)
        .order_by(UserActivityLog.timestamp.desc())
        .limit(10)
    )
    recent_logs = recent_result.scalars().all()
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
