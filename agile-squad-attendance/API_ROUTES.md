# API Routes Documentation

Base URL: `http://localhost:8000/api`

## Authentication Routes

### POST /api/register
Register a new user account
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### POST /api/login
Login with email and password
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```
Response:
```json
{
  "token": "1|abc123...",
  "user": { ... }
}
```

### POST /api/logout
Logout current user (requires auth)

### GET /api/user
Get authenticated user details (requires auth)

### GET /api/auth/google
Redirect to Google OAuth

### GET /api/auth/google/callback
Handle Google OAuth callback

### GET /api/auth/microsoft
Redirect to Microsoft OAuth

### GET /api/auth/microsoft/callback
Handle Microsoft OAuth callback

## Squad Management Routes

### GET /api/squads
List all squads (with pagination)
Query params: `?page=1&per_page=15&search=term`

### POST /api/squads
Create a new squad (admin only)
```json
{
  "name": "Development Team Alpha",
  "description": "Frontend development squad",
  "timezone": "America/New_York",
  "workdays": [1, 2, 3, 4, 5],
  "sprint_duration_days": 14,
  "jira_board_id": "DEV",
  "project_key": "PROJ-123"
}
```

### GET /api/squads/{id}
Get squad details

### PUT /api/squads/{id}
Update squad (admin/squad lead)

### DELETE /api/squads/{id}
Delete squad (admin only)

### GET /api/squads/{id}/members
List squad members

### POST /api/squads/{id}/members
Add member to squad
```json
{
  "user_id": 1,
  "role": "member",
  "joined_at": "2025-01-15"
}
```

### DELETE /api/squads/{id}/members/{userId}
Remove member from squad

### GET /api/squads/{id}/sprints
List squad sprints

### GET /api/squads/{id}/active-sprint
Get current active sprint

## Sprint Management Routes

### GET /api/sprints
List all sprints

### POST /api/sprints
Create a new sprint
```json
{
  "squad_id": "uuid",
  "name": "Sprint 24",
  "description": "Q1 2025 Sprint 1",
  "start_date": "2025-01-15",
  "end_date": "2025-01-28",
  "status": "planned",
  "goals": ["Feature A", "Bug fixes"]
}
```

### GET /api/sprints/{id}
Get sprint details

### PUT /api/sprints/{id}
Update sprint

### PATCH /api/sprints/{id}/status
Update sprint status
```json
{
  "status": "active"
}
```

### GET /api/sprints/{id}/attendance
Get attendance records for sprint

## Attendance Routes

### GET /api/attendance
List attendance records
Query params: `?date=2025-01-15&squad_id=uuid&user_id=1`

### POST /api/attendance/check-in
Check in for the day
```json
{
  "squad_id": "uuid",
  "work_mode": "remote",
  "event_tag": "standup",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "notes": "Working from home today"
}
```

### POST /api/attendance/check-out
Check out
```json
{
  "attendance_id": "uuid",
  "latitude": 40.7128,
  "longitude": -74.0060,
  "notes": "Day completed"
}
```

### GET /api/attendance/{id}
Get attendance record details

### PUT /api/attendance/{id}
Update attendance record (admin/squad lead)

### DELETE /api/attendance/{id}
Delete attendance record (admin only)

### GET /api/attendance/today
Get today's attendance for current user

### GET /api/attendance/squad/{squadId}/today
Get today's attendance for entire squad (presence board)

### GET /api/attendance/stats
Get attendance statistics
Query params: `?squad_id=uuid&start_date=2025-01-01&end_date=2025-01-31`

## Leave Management Routes

### GET /api/leave-requests
List leave requests
Query params: `?status=pending&squad_id=uuid`

### POST /api/leave-requests
Create leave request
```json
{
  "squad_id": "uuid",
  "leave_type": "vacation",
  "start_date": "2025-02-01",
  "end_date": "2025-02-05",
  "reason": "Family vacation",
  "attachments": ["url1", "url2"]
}
```

### GET /api/leave-requests/{id}
Get leave request details

### PUT /api/leave-requests/{id}
Update leave request (if still pending)

### DELETE /api/leave-requests/{id}
Cancel leave request

### POST /api/leave-requests/{id}/approve
Approve leave request (squad lead/admin)
```json
{
  "comments": "Approved for dates"
}
```

### POST /api/leave-requests/{id}/reject
Reject leave request (squad lead/admin)
```json
{
  "rejection_reason": "Overlapping team schedules"
}
```

### GET /api/leave-requests/pending-approvals
Get leave requests pending approval (for leads/admins)

### GET /api/leave-requests/calendar
Get leave calendar view
Query params: `?squad_id=uuid&month=2025-02`

## User Management Routes

### GET /api/users
List all users (admin only)
Query params: `?role=member&squad_id=uuid&search=name`

### GET /api/users/{id}
Get user details

### PUT /api/users/{id}
Update user (admin or self)

### PATCH /api/users/{id}/role
Update user role (admin only)
```json
{
  "role": "squad_lead"
}
```

### DELETE /api/users/{id}
Deactivate user (admin only)

### GET /api/users/{id}/attendance
Get user attendance history

### GET /api/users/{id}/leave-requests
Get user leave requests

## Compliance Routes

### GET /api/compliance/rules
List compliance rules
Query params: `?squad_id=uuid`

### POST /api/compliance/rules
Create compliance rule (admin)
```json
{
  "squad_id": "uuid",
  "rule_name": "Minimum Hours",
  "description": "Minimum 8 hours per day",
  "rule_type": "minimum_hours",
  "rule_config": {
    "minimum_hours": 8,
    "grace_period_minutes": 15
  },
  "severity": 3
}
```

### GET /api/compliance/rules/{id}
Get rule details

### PUT /api/compliance/rules/{id}
Update rule (admin)

### DELETE /api/compliance/rules/{id}
Delete rule (admin)

### GET /api/compliance/scores
List compliance scores
Query params: `?squad_id=uuid&period_type=weekly`

### GET /api/compliance/scores/{id}
Get compliance score details

### GET /api/compliance/violations
List compliance violations
Query params: `?squad_id=uuid&user_id=1&start_date=2025-01-01`

## Reports Routes

### GET /api/reports/dashboard
Get dashboard summary
Query params: `?squad_id=uuid&period=week`

### GET /api/reports/attendance
Generate attendance report
Query params: `?squad_id=uuid&start_date=2025-01-01&end_date=2025-01-31&format=json`

### GET /api/reports/attendance/export
Export attendance report (CSV/PDF)
Query params: `?squad_id=uuid&start_date=2025-01-01&end_date=2025-01-31&format=csv`

### GET /api/reports/leave
Generate leave report

### GET /api/reports/compliance
Generate compliance report

### GET /api/reports/sprint/{sprintId}
Generate sprint attendance report

## Integration Routes

### GET /api/integrations
List configured integrations

### POST /api/integrations
Configure new integration (admin)
```json
{
  "type": "slack",
  "name": "Team Slack",
  "config": {
    "webhook_url": "https://hooks.slack.com/...",
    "channel": "#attendance"
  }
}
```

### GET /api/integrations/{id}
Get integration details

### PUT /api/integrations/{id}
Update integration

### DELETE /api/integrations/{id}
Remove integration

### POST /api/integrations/{id}/test
Test integration connection

### POST /api/integrations/sync
Manually trigger sync (calendar, Jira, etc.)

## Audit Log Routes

### GET /api/audit-logs
List audit logs (admin only)
Query params: `?user_id=1&model_type=AttendanceRecord&action=update`

### GET /api/audit-logs/{id}
Get audit log details

## Notification Routes

### GET /api/notifications
List user notifications

### PUT /api/notifications/{id}/read
Mark notification as read

### POST /api/notifications/read-all
Mark all notifications as read

### DELETE /api/notifications/{id}
Delete notification

## Settings Routes

### GET /api/settings
Get system settings (admin)

### PUT /api/settings
Update system settings (admin)

### GET /api/settings/timezones
List available timezones

### GET /api/settings/leave-types
List configured leave types

## Health Check

### GET /api/health
API health check endpoint
Response:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:30:00Z",
  "database": "connected",
  "version": "1.0.0"
}
```

## Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["validation error"]
  }
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [...],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 15,
    "total": 73
  },
  "links": {
    "first": "url",
    "last": "url",
    "prev": null,
    "next": "url"
  }
}
```

## Authentication

Most endpoints require authentication using Bearer token:
```
Authorization: Bearer {token}
```

## Rate Limiting

- Public endpoints: 60 requests per minute
- Authenticated endpoints: 120 requests per minute
- Admin endpoints: 200 requests per minute
