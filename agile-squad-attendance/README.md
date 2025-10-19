# Agile Squad Attendance Management Platform

A comprehensive attendance management system for agile teams built with Laravel 11 and Vue 3.

## 🚀 Project Status

### ✅ Completed
- Laravel 11 backend setup with Sanctum authentication
- Complete database schema with migrations
- Core Eloquent models with relationships
- Database tables for:
  - Users with role-based access (Admin, Squad Lead, Member, Viewer)
  - Squads with configuration
  - Squad members
  - Sprints
  - Attendance records with geolocation
  - Leave requests and approvals
  - Compliance rules and scores
  - Audit logs
  - Integrations

### 🚧 In Progress
- Vue 3 frontend setup with Vite
- API routes and controllers
- Authentication system (SSO + Email/Password)

### 📋 Pending
- Frontend components and views
- API integration
- Real-time features with WebSockets
- Calendar integrations (Google/Outlook)
- Communication platform integrations (Slack/MS Teams)
- Jira integration
- Report generation
- File upload to S3

## 🏗️ Tech Stack

### Backend
- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum + Socialite (SSO)
- **Database**: SQLite (development) / MySQL/PostgreSQL (production)
- **Queue**: Redis (production) / Database (development)

### Frontend
- **Framework**: Vue 3 (Options API)
- **Build Tool**: Vite
- **State Management**: Pinia (planned)
- **UI Framework**: Tailwind CSS + Headless UI (planned)
- **Router**: Vue Router

## 📁 Project Structure

```
agile-squad-attendance/
├── backend/              # Laravel 11 API
│   ├── app/
│   │   └── Models/      # Eloquent models
│   ├── database/
│   │   └── migrations/  # Database migrations
│   └── routes/          # API routes
└── frontend/            # Vue 3 SPA
    ├── src/
    │   ├── components/
    │   ├── views/
    │   ├── router/
    │   └── stores/
    └── public/
```

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts with roles and SSO support
- `squads` - Team/squad information
- `squad_members` - Many-to-many relationship with roles
- `sprints` - Sprint tracking per squad
- `attendance_records` - Check-in/out with metadata
- `leave_requests` - Leave management
- `leave_approvals` - Approval workflow
- `compliance_rules` - Configurable rules per squad
- `compliance_scores` - Weekly/sprint scores
- `audit_logs` - Complete audit trail
- `integrations` - External API configurations

## 🔑 Key Features

### User Roles
- **Admin**: Full system access
- **Squad Lead**: Manage squad, approve leaves
- **Member**: Track attendance, request leave
- **Viewer**: Read-only access

### Attendance Tracking
- Check-in/Check-out with timestamps
- Work mode tracking (Remote, Office, Client Site, OOO)
- Event tagging (Standup, Retro, Planning, Demo)
- Optional geolocation tracking
- Sprint-based context

### Leave Management
- Multiple leave types (Vacation, Sick, Public Holiday, Training)
- Multi-level approval workflow
- Document attachments
- Calendar integration

### Compliance & Rules
- Custom rules per squad
- Automated scoring
- Anomaly detection
- Alert system

## 🚀 Getting Started

### Backend Setup
```bash
cd agile-squad-attendance/backend
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate
php artisan serve
```

### Frontend Setup (In Progress)
```bash
cd agile-squad-attendance/frontend
npm install
npm run dev
```

## 📝 Environment Variables

### Backend (.env)
```
APP_NAME="Agile Squad Attendance"
APP_ENV=local
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

SANCTUM_STATEFUL_DOMAINS=localhost:5173

# SSO Configuration
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_REDIRECT_URI=

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=
AWS_BUCKET=
```

## 🔐 API Authentication

The API uses Laravel Sanctum for token-based authentication:
- Email/Password login
- Google SSO
- Microsoft SSO

## 📚 Documentation

Detailed API documentation will be available at `/api/documentation` once Swagger/OpenAPI integration is complete.

## 🧪 Testing

```bash
# Backend tests
cd backend
php artisan test

# Frontend tests (to be added)
cd frontend
npm run test
```

## 📄 License

This project is proprietary software.

## 👥 Team

Built for agile teams to manage attendance efficiently.
