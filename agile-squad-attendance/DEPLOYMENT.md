# Deployment Guide

## Prerequisites

### Backend Requirements
- PHP 8.2 or higher
- Composer 2.x
- MySQL 8.0+ or PostgreSQL 13+
- Laravel 11

### Frontend Requirements
- Node.js 18+ and npm 9+
- Modern web browser

## Local Development Setup

### 1. Backend Setup

```bash
# Navigate to backend directory
cd agile-squad-attendance/backend

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=attendance_db
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Configure Sanctum for frontend
SANCTUM_STATEFUL_DOMAINS=localhost:5173
SESSION_DOMAIN=localhost
FRONTEND_URL=http://localhost:5173

# Run migrations
php artisan migrate

# Seed development data (optional)
php artisan db:seed --class=DevelopmentSeeder

# Start development server
php artisan serve
# Backend will be available at http://localhost:8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd agile-squad-attendance/frontend

# Install dependencies
npm install

# Environment is already configured in .env
# VITE_API_URL=http://localhost:8000/api

# Start development server
npm run dev
# Frontend will be available at http://localhost:5173
```

### 3. Test Accounts (if seeded)

After running the seeder, you can login with:

- **Admin**: admin@example.com / password
- **Squad Lead**: lead@example.com / password
- **Member**: john@example.com / password
- **Member**: jane@example.com / password

## Production Deployment

### Backend (Laravel)

#### Option 1: Traditional Server (Apache/Nginx)

```bash
# 1. Clone repository
git clone <repository-url>
cd agile-squad-attendance/backend

# 2. Install dependencies
composer install --optimize-autoloader --no-dev

# 3. Setup environment
cp .env.example .env
php artisan key:generate

# 4. Configure production settings in .env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://api.yourdomain.com

DB_CONNECTION=mysql
DB_HOST=your_db_host
DB_DATABASE=your_db_name
DB_USERNAME=your_db_user
DB_PASSWORD=your_db_password

SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
SESSION_DOMAIN=.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# 5. Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# 6. Run migrations
php artisan migrate --force

# 7. Set permissions
chmod -R 755 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache

# 8. Configure web server to point to public/ directory
```

**Nginx Configuration Example:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;
    root /var/www/attendance/backend/public;

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

#### Option 2: Laravel Forge

1. Create a new server on Laravel Forge
2. Create a new site pointing to your repository
3. Set environment variables in Forge
4. Enable quick deploy
5. Deploy!

#### Option 3: Laravel Vapor (Serverless)

```bash
# Install Vapor CLI
composer require laravel/vapor-cli

# Initialize Vapor
php vendor/bin/vapor init

# Deploy
php vendor/bin/vapor deploy production
```

### Frontend (Vue 3)

#### Option 1: Static Hosting (Netlify, Vercel, Cloudflare Pages)

```bash
cd agile-squad-attendance/frontend

# Update .env for production
VITE_API_URL=https://api.yourdomain.com/api

# Build for production
npm run build

# Deploy the dist/ directory to your hosting provider
```

**Netlify Example:**
```toml
# netlify.toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

**Vercel Example:**
```json
{
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

#### Option 2: Docker

```dockerfile
# Dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

```nginx
# nginx.conf
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

```bash
# Build and run
docker build -t attendance-frontend .
docker run -p 80:80 attendance-frontend
```

## OAuth Configuration (Production)

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URIs:
   - `https://api.yourdomain.com/auth/google/callback`
6. Update backend .env:
```env
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=https://api.yourdomain.com/auth/google/callback
```

### Microsoft OAuth

1. Go to [Azure Portal](https://portal.azure.com/)
2. Register a new application
3. Add a redirect URI:
   - `https://api.yourdomain.com/auth/microsoft/callback`
4. Generate a client secret
5. Update backend .env:
```env
MICROSOFT_CLIENT_ID=your_client_id
MICROSOFT_CLIENT_SECRET=your_client_secret
MICROSOFT_REDIRECT_URI=https://api.yourdomain.com/auth/microsoft/callback
```

## Database Migrations

### Running Migrations

```bash
# Development
php artisan migrate

# Production (with confirmation)
php artisan migrate --force

# Rollback last migration
php artisan migrate:rollback

# Rollback all migrations
php artisan migrate:reset

# Fresh migration with seed
php artisan migrate:fresh --seed
```

## Environment Variables Reference

### Backend (.env)

```env
# Application
APP_NAME="Agile Squad Attendance"
APP_ENV=production
APP_KEY=
APP_DEBUG=false
APP_TIMEZONE=UTC
APP_URL=https://api.yourdomain.com

# Database
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=attendance_db
DB_USERNAME=root
DB_PASSWORD=

# Sanctum
SANCTUM_STATEFUL_DOMAINS=yourdomain.com
SESSION_DOMAIN=.yourdomain.com
FRONTEND_URL=https://yourdomain.com

# OAuth (Optional)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REDIRECT_URI=

MICROSOFT_CLIENT_ID=
MICROSOFT_CLIENT_SECRET=
MICROSOFT_REDIRECT_URI=

# Queue (Optional)
QUEUE_CONNECTION=redis

# Mail (Optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

### Frontend (.env)

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME="Agile Squad Attendance"
```

## Monitoring & Logging

### Laravel Telescope (Development)

```bash
composer require laravel/telescope --dev
php artisan telescope:install
php artisan migrate
```

Access at: `http://localhost:8000/telescope`

### Production Logging

Configure in `config/logging.php`:

```php
'channels' => [
    'stack' => [
        'driver' => 'stack',
        'channels' => ['single', 'slack'],
    ],
    
    'slack' => [
        'driver' => 'slack',
        'url' => env('LOG_SLACK_WEBHOOK_URL'),
        'username' => 'Laravel Log',
        'emoji' => ':boom:',
        'level' => 'critical',
    ],
],
```

## Performance Optimization

### Backend

```bash
# Cache configuration
php artisan config:cache

# Cache routes
php artisan route:cache

# Cache views
php artisan view:cache

# Optimize composer autoload
composer install --optimize-autoloader --no-dev

# Enable OPcache in php.ini
opcache.enable=1
opcache.memory_consumption=128
opcache.max_accelerated_files=10000
```

### Frontend

```bash
# Build with optimizations
npm run build

# Analyze bundle size
npm run build -- --mode=analyze
```

## Security Checklist

- [ ] SSL/TLS certificates installed
- [ ] Environment variables secured
- [ ] Database credentials rotated
- [ ] CORS properly configured
- [ ] Rate limiting enabled
- [ ] Input validation implemented
- [ ] SQL injection prevention (using Eloquent)
- [ ] XSS protection enabled
- [ ] CSRF protection active
- [ ] OAuth secrets secured
- [ ] File upload validation
- [ ] API authentication required
- [ ] Regular backups configured

## Troubleshooting

### CORS Issues

Update `config/cors.php`:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => [env('FRONTEND_URL')],
'supports_credentials' => true,
```

### Session/Cookie Issues

Ensure in backend .env:
```env
SESSION_DRIVER=cookie
SESSION_DOMAIN=.yourdomain.com
SANCTUM_STATEFUL_DOMAINS=yourdomain.com,www.yourdomain.com
```

### Database Connection Errors

```bash
# Test database connection
php artisan tinker
>>> DB::connection()->getPdo();
```

## Backup & Restore

### Database Backup

```bash
# MySQL
mysqldump -u username -p database_name > backup.sql

# Restore
mysql -u username -p database_name < backup.sql
```

### Automated Backups

Use Laravel Backup package:
```bash
composer require spatie/laravel-backup
php artisan backup:run
```

## Support & Resources

- [Laravel Documentation](https://laravel.com/docs/11.x)
- [Vue.js Documentation](https://vuejs.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
- [Sanctum Documentation](https://laravel.com/docs/11.x/sanctum)
