# Quick Deployment Script for Coding Crusaders (Windows PowerShell)
# This script automates common deployment tasks on Windows

$ErrorActionPreference = "Stop"

Write-Host "🚀 Coding Crusaders - Quick Deployment Helper" -ForegroundColor Cyan
Write-Host "==============================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ ERROR: .env file not found!" -ForegroundColor Red
    Write-Host "📝 Please copy .env.example to .env and fill in your values" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "   copy .env.example .env" -ForegroundColor White
    Write-Host "   # Edit .env with your configuration" -ForegroundColor Gray
    exit 1
}

Write-Host "✅ .env file found" -ForegroundColor Green
Write-Host ""

# Parse .env file
$env_content = Get-Content ".env" | Where-Object { $_ -notmatch "^#" -and $_.Trim() -ne "" }
foreach ($line in $env_content) {
    $key, $value = $line.Split("=", 2)
    if ($key -and $value) {
        [System.Environment]::SetEnvironmentVariable($key.Trim(), $value.Trim(), "Process")
    }
}

Write-Host "📋 Deployment Options:" -ForegroundColor Cyan
Write-Host "1. Local Development Setup" -ForegroundColor White
Write-Host "2. Prepare for Heroku" -ForegroundColor White
Write-Host "3. Prepare for DigitalOcean" -ForegroundColor White
Write-Host "4. Run Pre-Deployment Checks" -ForegroundColor White
Write-Host "5. Collect Static Files" -ForegroundColor White
Write-Host "6. Run Database Migrations" -ForegroundColor White
Write-Host "7. Create Superuser" -ForegroundColor White
Write-Host ""

$option = Read-Host "Select an option (1-7)"

switch ($option) {
    "1" {
        Write-Host "🔧 Setting up local development environment..." -ForegroundColor Cyan
        Write-Host ""
        
        # Create virtual environment
        if (-not (Test-Path "venv")) {
            Write-Host "Creating virtual environment..." -ForegroundColor Yellow
            python -m venv venv
        }
        
        # Activate virtual environment
        Write-Host "Activating virtual environment..." -ForegroundColor Yellow
        & "venv\Scripts\Activate.ps1"
        
        # Install requirements
        Write-Host "Installing dependencies..." -ForegroundColor Yellow
        pip install -r requirements.txt
        
        # Run migrations
        Write-Host "Running database migrations..." -ForegroundColor Yellow
        python manage.py migrate
        
        # Collect static files
        Write-Host "Collecting static files..." -ForegroundColor Yellow
        python manage.py collectstatic --noinput
        
        Write-Host ""
        Write-Host "✅ Local setup complete!" -ForegroundColor Green
        Write-Host "Run: python manage.py runserver" -ForegroundColor Cyan
    }
    
    "2" {
        Write-Host "🚀 Preparing for Heroku deployment..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check for Git
        if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Git not found. Please install Git first." -ForegroundColor Red
            exit 1
        }
        
        # Check for Heroku CLI
        if (-not (Get-Command heroku -ErrorAction SilentlyContinue)) {
            Write-Host "❌ Heroku CLI not found." -ForegroundColor Red
            Write-Host "📝 Install from: https://devcenter.heroku.com/articles/heroku-cli" -ForegroundColor Yellow
            exit 1
        }
        
        Write-Host "✅ Heroku CLI found" -ForegroundColor Green
        Write-Host ""
        Write-Host "📝 Next steps:" -ForegroundColor Cyan
        Write-Host "1. Create Heroku app: heroku create <app-name>" -ForegroundColor White
        Write-Host "2. Set environment variables: heroku config:set KEY=value" -ForegroundColor White
        Write-Host "3. Deploy: git push heroku main" -ForegroundColor White
        Write-Host "4. Run migrations: heroku run python manage.py migrate" -ForegroundColor White
        Write-Host "5. Create superuser: heroku run python manage.py createsuperuser" -ForegroundColor White
        Write-Host "6. Open app: heroku open" -ForegroundColor White
    }
    
    "3" {
        Write-Host "🌊 Preparing for DigitalOcean deployment..." -ForegroundColor Cyan
        Write-Host ""
        Write-Host "📝 Steps:" -ForegroundColor Cyan
        Write-Host "1. Create GitHub repository and push code" -ForegroundColor White
        Write-Host "2. Connect to DigitalOcean App Platform" -ForegroundColor White
        Write-Host "3. Configure environment variables in dashboard" -ForegroundColor White
        Write-Host "4. Set build command: pip install -r requirements.txt && python manage.py collectstatic --noinput" -ForegroundColor White
        Write-Host "5. Set run command: gunicorn crusaders_project.wsgi" -ForegroundColor White
        Write-Host "6. Deploy" -ForegroundColor White
    }
    
    "4" {
        Write-Host "🔍 Running pre-deployment checks..." -ForegroundColor Cyan
        Write-Host ""
        
        # Check SECRET_KEY
        $secretKey = [System.Environment]::GetEnvironmentVariable("DJANGO_SECRET_KEY")
        if ([string]::IsNullOrEmpty($secretKey)) {
            Write-Host "❌ DJANGO_SECRET_KEY not set in .env" -ForegroundColor Red
        } else {
            Write-Host "✅ DJANGO_SECRET_KEY configured" -ForegroundColor Green
        }
        
        # Check DEBUG
        $debug = [System.Environment]::GetEnvironmentVariable("DEBUG")
        if ($debug -eq "True") {
            Write-Host "❌ DEBUG is True - must be False in production" -ForegroundColor Red
        } else {
            Write-Host "✅ DEBUG is False" -ForegroundColor Green
        }
        
        # Check ALLOWED_HOSTS
        $hosts = [System.Environment]::GetEnvironmentVariable("ALLOWED_HOSTS")
        if ([string]::IsNullOrEmpty($hosts)) {
            Write-Host "❌ ALLOWED_HOSTS not configured" -ForegroundColor Red
        } else {
            Write-Host "✅ ALLOWED_HOSTS: $hosts" -ForegroundColor Green
        }
        
        # Check database
        $dbName = [System.Environment]::GetEnvironmentVariable("DB_NAME")
        if ([string]::IsNullOrEmpty($dbName)) {
            Write-Host "❌ Database not configured" -ForegroundColor Red
        } else {
            Write-Host "✅ Database: $dbName" -ForegroundColor Green
        }
        
        # Check email
        $emailUser = [System.Environment]::GetEnvironmentVariable("EMAIL_HOST_USER")
        if ([string]::IsNullOrEmpty($emailUser)) {
            Write-Host "❌ Email not configured" -ForegroundColor Red
        } else {
            Write-Host "✅ Email: $emailUser" -ForegroundColor Green
        }
        
        # Check Python syntax
        Write-Host ""
        Write-Host "Checking Python syntax..." -ForegroundColor Yellow
        python -m py_compile manage.py
        python -m py_compile crusaders_project/settings.py
        python -m py_compile crusaders_project/wsgi.py
        Write-Host "✅ Python syntax OK" -ForegroundColor Green
        
        Write-Host ""
        Write-Host "✅ Pre-deployment checks complete!" -ForegroundColor Green
    }
    
    "5" {
        Write-Host "📦 Collecting static files..." -ForegroundColor Cyan
        python manage.py collectstatic --noinput --clear
        Write-Host "✅ Static files collected to staticfiles/" -ForegroundColor Green
    }
    
    "6" {
        Write-Host "🗄️  Running database migrations..." -ForegroundColor Cyan
        python manage.py migrate
        Write-Host "✅ Migrations complete!" -ForegroundColor Green
    }
    
    "7" {
        Write-Host "👤 Creating superuser..." -ForegroundColor Cyan
        python manage.py createsuperuser
        Write-Host "✅ Superuser created!" -ForegroundColor Green
    }
    
    default {
        Write-Host "❌ Invalid option" -ForegroundColor Red
        exit 1
    }
}

Write-Host ""
Write-Host "Done! 🎉" -ForegroundColor Green
