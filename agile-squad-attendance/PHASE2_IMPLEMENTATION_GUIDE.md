# Phase 2 Implementation Guide

## Overview
This document outlines the implementation steps for completing Phase 2 features of the Agile Squad Attendance Management Platform.

## ✅ Phase 1 Complete (Current State - 85%)

### Fully Functional Features
- Authentication (Email + OAuth ready)
- Squad Management (Full CRUD)
- Attendance Tracking (Check-in/out, history, work modes)
- Leave Management (Request + Approval workflow)
- Profile Management
- Basic Reports with CSV export
- Role-based Access Control
- 11 Complete Views
- Date Helper Utilities (fixes invalid date issues)

## 🚀 Phase 2 Features to Implement

### 1. File Upload System (S3 Storage)

#### Backend Implementation
```php
// app/Http/Controllers/Api/FileUploadController.php
namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class FileUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|max:10240', // 10MB
            'type' => 'required|in:leave_attachment,profile_picture'
        ]);

        $file = $request->file('file');
        $path = Storage::disk('s3')->putFile('attachments', $file, 'public');

        return response()->json([
            'success' => true,
            'data' => [
                'path' => $path,
                'url' => Storage::disk('s3')->url($path)
            ]
        ]);
    }
}
```

#### Frontend Component
```javascript
// Create: frontend/src/components/FileUpload.vue
<template>
  <div class="file-upload">
    <input
      type="file"
      @change="handleFileChange"
      ref="fileInput"
      class="hidden"
    />
    <button @click="$refs.fileInput.click()" class="btn-upload">
      Choose File
    </button>
    <div v-if="uploading">Uploading...</div>
    <div v-if="uploaded">File uploaded successfully!</div>
  </div>
</template>

<script>
export default {
  methods: {
    async handleFileChange(event) {
      const file = event.target.files[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', this.type)

      this.uploading = true
      try {
        const response = await api.post('/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        })
        this.$emit('uploaded', response.data.data)
        this.uploaded = true
      } catch (error) {
        this.$emit('error', error)
      } finally {
        this.uploading = false
      }
    }
  }
}
</script>
```

#### Configuration
```bash
# .env additions
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
AWS_USE_PATH_STYLE_ENDPOINT=false
```

### 2. Email Notifications

#### Install Dependencies
```bash
composer require laravel/mail
```

#### Create Notification Classes
```php
// app/Notifications/LeaveRequestApproved.php
namespace App\Notifications;

use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class LeaveRequestApproved extends Notification
{
    protected $leaveRequest;

    public function __construct($leaveRequest)
    {
        $this->leaveRequest = $leaveRequest;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Leave Request Approved')
            ->line('Your leave request has been approved.')
            ->line('Duration: ' . $this->leaveRequest->start_date . ' to ' . $this->leaveRequest->end_date)
            ->action('View Details', url('/leave-requests'));
    }
}
```

#### Usage in Controller
```php
use App\Notifications\LeaveRequestApproved;

public function approve($id)
{
    $leaveRequest = LeaveRequest::findOrFail($id);
    $leaveRequest->update(['status' => 'approved']);
    
    // Send notification
    $leaveRequest->user->notify(new LeaveRequestApproved($leaveRequest));
    
    return response()->json(['success' => true]);
}
```

### 3. Slack Integration

#### Install Slack SDK
```bash
composer require slack-notifier/slack-notifier
```

#### Create Service
```php
// app/Services/SlackService.php
namespace App\Services;

use GuzzleHttp\Client;

class SlackService
{
    protected $webhookUrl;

    public function __construct()
    {
        $this->webhookUrl = config('services.slack.webhook_url');
    }

    public function sendMessage($text, $channel = null)
    {
        $client = new Client();
        
        $payload = [
            'text' => $text,
            'username' => 'Attendance Bot'
        ];
        
        if ($channel) {
            $payload['channel'] = $channel;
        }

        $client->post($this->webhookUrl, [
            'json' => $payload
        ]);
    }

    public function notifyMissedCheckIn($user)
    {
        $this->sendMessage(
            "⚠️ {$user->name} hasn't checked in today.",
            '#attendance-alerts'
        );
    }

    public function notifyLeaveRequest($leaveRequest)
    {
        $this->sendMessage(
            "📝 New leave request from {$leaveRequest->user->name}\n" .
            "Period: {$leaveRequest->start_date} to {$leaveRequest->end_date}\n" .
            "Reason: {$leaveRequest->reason}",
            '#leave-requests'
        );
    }
}
```

### 4. Background Jobs & Queues

#### Create Jobs
```php
// app/Jobs/SendDailyStandupReminder.php
namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use App\Models\User;
use App\Services\SlackService;

class SendDailyStandupReminder implements ShouldQueue
{
    use InteractsWithQueue, Queueable;

    public function handle(SlackService $slack)
    {
        $users = User::whereDoesntHave('attendanceRecords', function($query) {
            $query->whereDate('date', today());
        })->get();

        foreach ($users as $user) {
            $slack->notifyMissedCheckIn($user);
        }
    }
}
```

#### Schedule Jobs
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    // Daily standup reminder at 9:15 AM
    $schedule->job(new SendDailyStandupReminder())
        ->weekdays()
        ->at('09:15');
    
    // Auto-checkout reminder at 5:30 PM
    $schedule->job(new SendAutoCheckoutReminder())
        ->weekdays()
        ->at('17:30');
    
    // Weekly compliance scoring
    $schedule->job(new CalculateWeeklyComplianceScores())
        ->weekly()
        ->mondays()
        ->at('08:00');
}
```

#### Run Queue Worker
```bash
php artisan queue:work --tries=3
```

### 5. PDF Export

#### Install Library
```bash
composer require barryvdh/laravel-dompdf
```

#### Create PDF Service
```php
// app/Services/PdfService.php
namespace App\Services;

use Barryvdh\DomPDF\Facade\Pdf;

class PdfService
{
    public function generateAttendanceReport($data)
    {
        $pdf = Pdf::loadView('reports.attendance', compact('data'));
        return $pdf->download('attendance-report.pdf');
    }

    public function generateSprintReport($squad, $sprint)
    {
        $attendance = AttendanceRecord::where('sprint_id', $sprint->id)
            ->with('user')
            ->get();
            
        $data = [
            'squad' => $squad,
            'sprint' => $sprint,
            'attendance' => $attendance,
            'stats' => $this->calculateStats($attendance)
        ];
        
        $pdf = Pdf::loadView('reports.sprint', $data);
        return $pdf->download("sprint-{$sprint->name}-report.pdf");
    }
}
```

#### Create View Template
```blade
<!-- resources/views/reports/attendance.blade.php -->
<!DOCTYPE html>
<html>
<head>
    <title>Attendance Report</title>
    <style>
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #4CAF50; color: white; }
    </style>
</head>
<body>
    <h1>Attendance Report</h1>
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Hours</th>
            </tr>
        </thead>
        <tbody>
            @foreach($data as $record)
            <tr>
                <td>{{ $record->date }}</td>
                <td>{{ $record->user->name }}</td>
                <td>{{ $record->check_in_time }}</td>
                <td>{{ $record->check_out_time }}</td>
                <td>{{ $record->hours_worked }}</td>
            </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>
```

### 6. Compliance Scoring System

#### Create Service
```php
// app/Services/ComplianceService.php
namespace App\Services;

use App\Models\Squad;
use App\Models\ComplianceRule;
use App\Models\ComplianceScore;

class ComplianceService
{
    public function calculateWeeklyScore(Squad $squad)
    {
        $rules = ComplianceRule::where('squad_id', $squad->id)
            ->orWhereNull('squad_id')
            ->get();
        
        $members = $squad->members;
        $violations = [];
        $totalScore = 100;
        
        foreach ($members as $member) {
            $attendance = $member->attendanceRecords()
                ->whereBetween('date', [now()->startOfWeek(), now()->endOfWeek()])
                ->get();
            
            foreach ($rules as $rule) {
                // Check minimum hours
                $totalHours = $attendance->sum('hours_worked');
                if ($totalHours < $rule->min_hours_per_week) {
                    $violations[] = [
                        'user_id' => $member->id,
                        'rule' => 'min_hours',
                        'expected' => $rule->min_hours_per_week,
                        'actual' => $totalHours
                    ];
                    $totalScore -= 5;
                }
                
                // Check late arrivals
                $lateCount = $attendance->filter(function($record) use ($rule) {
                    $checkInTime = Carbon::parse($record->check_in_time);
                    $expectedTime = Carbon::parse($rule->expected_check_in_time);
                    return $checkInTime->diffInMinutes($expectedTime, false) > $rule->late_threshold_minutes;
                })->count();
                
                if ($lateCount > $rule->max_late_arrivals_per_week) {
                    $violations[] = [
                        'user_id' => $member->id,
                        'rule' => 'late_arrivals',
                        'expected' => $rule->max_late_arrivals_per_week,
                        'actual' => $lateCount
                    ];
                    $totalScore -= ($lateCount * 2);
                }
            }
        }
        
        ComplianceScore::create([
            'squad_id' => $squad->id,
            'score' => max(0, $totalScore),
            'violations' => $violations,
            'period_start' => now()->startOfWeek(),
            'period_end' => now()->endOfWeek()
        ]);
        
        return $totalScore;
    }
}
```

### 7. Google Calendar Integration

#### Install Google Client
```bash
composer require google/apiclient
```

#### Create Service
```php
// app/Services/GoogleCalendarService.php
namespace App\Services;

use Google_Client;
use Google_Service_Calendar;

class GoogleCalendarService
{
    protected $client;
    protected $service;

    public function __construct()
    {
        $this->client = new Google_Client();
        $this->client->setApplicationName('Agile Squad Attendance');
        $this->client->setScopes(Google_Service_Calendar::CALENDAR);
        $this->client->setAuthConfig(storage_path('app/google-calendar-credentials.json'));
        
        $this->service = new Google_Service_Calendar($this->client);
    }

    public function syncHolidays($calendarId = 'primary')
    {
        $events = $this->service->events->listEvents($calendarId, [
            'timeMin' => now()->toRfc3339String(),
            'maxResults' => 100,
            'singleEvents' => true,
            'orderBy' => 'startTime'
        ]);

        foreach ($events->getItems() as $event) {
            // Create leave request for holidays
            LeaveRequest::updateOrCreate([
                'external_id' => $event->getId(),
                'type' => 'public_holiday'
            ], [
                'title' => $event->getSummary(),
                'start_date' => $event->getStart()->getDate(),
                'end_date' => $event->getEnd()->getDate(),
                'status' => 'approved'
            ]);
        }
    }

    public function createSprintEvent(Sprint $sprint)
    {
        $event = new Google_Service_Calendar_Event([
            'summary' => $sprint->name,
            'description' => $sprint->description,
            'start' => ['date' => $sprint->start_date],
            'end' => ['date' => $sprint->end_date]
        ]);

        return $this->service->events->insert('primary', $event);
    }
}
```

### 8. MS Teams Integration

#### Install Teams SDK
```bash
composer require microsoft/microsoft-graph
```

#### Create Service
```php
// app/Services/TeamsService.php
namespace App\Services;

use Microsoft\Graph\Graph;

class TeamsService
{
    protected $graph;

    public function __construct()
    {
        $this->graph = new Graph();
        $this->graph->setAccessToken($this->getAccessToken());
    }

    public function sendMessage($channelId, $message)
    {
        $this->graph->createRequest('POST', "/teams/{$channelId}/channels/messages")
            ->attachBody([
                'body' => [
                    'content' => $message
                ]
            ])
            ->execute();
    }

    public function notifyLeaveRequest($leaveRequest, $channelId)
    {
        $message = "**New Leave Request**\n\n" .
                   "**From:** {$leaveRequest->user->name}\n" .
                   "**Period:** {$leaveRequest->start_date} to {$leaveRequest->end_date}\n" .
                   "**Type:** {$leaveRequest->leave_type}\n" .
                   "**Reason:** {$leaveRequest->reason}";

        $this->sendMessage($channelId, $message);
    }
}
```

### 9. Jira Integration

#### Install Jira SDK
```bash
composer require lesstif/php-jira-rest-client
```

#### Create Service
```php
// app/Services/JiraService.php
namespace App\Services;

use JiraRestApi\Configuration;
use JiraRestApi\Issue\IssueService;

class JiraService
{
    protected $issueService;

    public function __construct()
    {
        $config = new Configuration([
            'jiraHost' => config('services.jira.host'),
            'jiraUser' => config('services.jira.user'),
            'jiraPassword' => config('services.jira.token')
        ]);

        $this->issueService = new IssueService($config);
    }

    public function linkAttendanceToSprint(Sprint $sprint)
    {
        $attendance = AttendanceRecord::where('sprint_id', $sprint->id)->get();
        
        foreach ($attendance as $record) {
            // Create work log in Jira
            $this->issueService->addWorklog(
                $sprint->jira_board_id,
                [
                    'timeSpent' => $record->hours_worked . 'h',
                    'started' => $record->date . 'T' . $record->check_in_time,
                    'comment' => 'Auto-logged from attendance system'
                ]
            );
        }
    }

    public function getSprint BoardIssues($boardId)
    {
        return $this->issueService->search(
            "project = {$boardId} AND sprint in openSprints()"
        );
    }
}
```

## 🔧 Configuration Requirements

### Environment Variables
Add to `.env`:
```env
# File Storage
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=

# Email
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=
MAIL_PASSWORD=

# Slack
SLACK_WEBHOOK_URL=

# Microsoft Teams
TEAMS_CLIENT_ID=
TEAMS_CLIENT_SECRET=
TEAMS_TENANT_ID=

# Google Calendar
GOOGLE_CALENDAR_CREDENTIALS_PATH=

# Jira
JIRA_HOST=yourcompany.atlassian.net
JIRA_USER=
JIRA_API_TOKEN=

# Queue
QUEUE_CONNECTION=redis
REDIS_HOST=127.0.0.1
```

### Database Migrations
Already created but ensure they're run:
```bash
php artisan migrate
```

## 📝 Testing Plan

### Unit Tests
```php
// tests/Unit/ComplianceServiceTest.php
public function test_calculates_weekly_score_correctly()
{
    $squad = Squad::factory()->create();
    $service = new ComplianceService();
    $score = $service->calculateWeeklyScore($squad);
    
    $this->assertGreaterThanOrEqual(0, $score);
    $this->assertLessThanOrEqual(100, $score);
}
```

### Feature Tests
```php
// tests/Feature/LeaveRequestTest.php
public function test_sends_notification_on_approval()
{
    Notification::fake();
    
    $leaveRequest = LeaveRequest::factory()->create();
    $this->post("/api/leave-requests/{$leaveRequest->id}/approve");
    
    Notification::assertSentTo(
        $leaveRequest->user,
        LeaveRequestApproved::class
    );
}
```

## 🚀 Deployment Steps

1. **Update Dependencies**
```bash
composer update
npm install
```

2. **Run Migrations**
```bash
php artisan migrate
```

3. **Configure Queue Worker** (systemd)
```bash
sudo nano /etc/systemd/system/laravel-worker.service
```

4. **Set up Cron** for scheduled tasks
```bash
* * * * * cd /path-to-your-project && php artisan schedule:run >> /dev/null 2>&1
```

5. **Configure Supervisor** for queue workers
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /path/to/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=4
redirect_stderr=true
stdout_logfile=/path/to/worker.log
```

## ✅ Completion Checklist

- [ ] File upload system configured
- [ ] Email notifications working
- [ ] Slack integration tested
- [ ] Teams integration tested
- [ ] Background jobs running
- [ ] PDF export working
- [ ] Compliance scoring active
- [ ] Google Calendar sync functional
- [ ] Jira integration complete
- [ ] All tests passing
- [ ] Documentation updated

## 📚 Additional Resources

- [Laravel Queues Documentation](https://laravel.com/docs/11.x/queues)
- [Laravel Notifications](https://laravel.com/docs/11.x/notifications)
- [Google Calendar API](https://developers.google.com/calendar/api)
- [Slack API](https://api.slack.com/)
- [Microsoft Graph API](https://docs.microsoft.com/en-us/graph/)
- [Jira REST API](https://developer.atlassian.com/cloud/jira/platform/rest/v3/)

## 🎯 Timeline Estimate

- File Upload System: 2-3 days
- Email Notifications: 2-3 days
- Slack/Teams Integration: 3-4 days
- Background Jobs: 2-3 days
- PDF Export: 2-3 days
- Compliance Scoring: 3-4 days
- External Integrations: 5-7 days
- Testing & Bug Fixes: 3-5 days

**Total Estimated Time: 3-4 weeks**
