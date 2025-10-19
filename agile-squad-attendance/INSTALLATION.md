# Installation Guide

## Prerequisites

- PHP 8.2 or higher
- Composer 2.x
- Node.js 18.x or higher
- npm or yarn
- MySQL 8.0+ or PostgreSQL 13+ (for production)
- Redis (optional, for queues and caching)

## Backend Installation

### 1. Navigate to Backend Directory
```bash
cd agile-squad-attendance/backend
```

### 2. Install PHP Dependencies
```bash
composer install
```

### 3. Environment Configuration
```bash
cp .env.example .env
```

Edit `.env` file and configure:
```env
APP_NAME="Agile Squad Attendance"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=attendance_db
DB_USERNAME=root
DB_PASSWORD=

# For development with SQLite
# DB_CONNECTION=sqlite

# CORS Configuration
SANCTUM_STATEFUL_DOMAINS=localhost:3000,localhost:5173
SESSION_DOMAIN=localhost
```

### 4. Generate Application Key
```bash
php artisan key:generate
```

### 5. Run Database Migrations
```bash
php artisan migrate
```

### 6. Seed Database (Optional)
```bash
php artisan db:seed
```

### 7. Start Development Server
```bash
php artisan serve
```

The API will be available at: `http://localhost:8000`

## Frontend Installation

### 1. Navigate to Frontend Directory
```bash
cd agile-squad-attendance/frontend
```

### 2. Install Node Dependencies
```bash
npm install
```

### 3. Environment Configuration
Create `.env` file:
```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME="Agile Squad Attendance"
```

### 4. Install Additional Packages
```bash
# Vue Router
npm install vue-router@4

# Pinia (State Management)
npm install pinia

# Axios (HTTP Client)
npm install axios

# Tailwind CSS
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Headless UI
npm install @headlessui/vue

# Additional utilities
npm install date-fns
npm install chart.js vue-chartjs
```

### 5. Start Development Server
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## Production Deployment

### Backend Production Steps

1. **Configure Production Environment**
```bash
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

2. **Optimize Autoloader**
```bash
composer install --optimize-autoloader --no-dev
```

3. **Set Proper Permissions**
```bash
chmod -R 755 storage bootstrap/cache
```

4. **Configure Queue Worker**
```bash
php artisan queue:work --daemon
```

5. **Set up Cron Job**
Add to crontab:
```cron
* * * * * cd /path-to-project/backend && php artisan schedule:run >> /dev/null 2>&1
```

### Frontend Production Build

```bash
cd frontend
npm run build
```

The build files will be in `frontend/dist` directory.

### Web Server Configuration

#### Apache (.htaccess)
```apache
<IfModule mod_rewrite.c>
    RewriteEngine On
    RewriteRule ^(.*)$ public/$1 [L]
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name example.com;
    root /path-to-project/backend/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

## SSO Configuration

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add redirect URI: `http://localhost:8000/auth/google/callback`
6. Update `.env`:
```env
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:8000/auth/google/callback
```

### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register an application
3. Add redirect URI: `http://localhost:8000/auth/microsoft/callback`
4. Update `.env`:
```env
MICROSOFT_CLIENT_ID=your-client-id
MICROSOFT_CLIENT_SECRET=your-client-secret
MICROSOFT_REDIRECT_URI=http://localhost:8000/auth/microsoft/callback
```

## AWS S3 Configuration

For file uploads (leave request attachments):

```env
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_USE_PATH_STYLE_ENDPOINT=false
```

## Troubleshooting

### Common Issues

**Issue**: "Class not found" errors
```bash
composer dump-autoload
```

**Issue**: Permission denied on storage
```bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

**Issue**: CORS errors from frontend
- Check `SANCTUM_STATEFUL_DOMAINS` in `.env`
- Verify `config/cors.php` settings

**Issue**: Database connection failed
- Verify database credentials in `.env`
- Ensure database exists
- Check database user permissions

## Verification

### Backend Health Check
```bash
curl http://localhost:8000/api/health
```

### Run Tests
```bash
cd backend
php artisan test
```

### Check Logs
```bash
tail -f storage/logs/laravel.log
```

## Support

For issues and questions, please refer to the project documentation or contact the development team.
