#!/bin/bash
# Quick Deployment Script for Coding Crusaders
# This script automates common deployment tasks

set -e  # Exit on error

echo "🚀 Coding Crusaders - Quick Deployment Helper"
echo "=============================================="
echo ""

# Check if .env file exists
if [ ! -f .env ]; then
    echo "❌ ERROR: .env file not found!"
    echo "📝 Please copy .env.example to .env and fill in your values"
    echo ""
    echo "   cp .env.example .env"
    echo "   # Edit .env with your configuration"
    exit 1
fi

echo "✅ .env file found"
echo ""

# Load environment variables
export $(cat .env | grep -v '^#' | xargs)

echo "📋 Deployment Options:"
echo "1. Local Development Setup"
echo "2. Prepare for Heroku"
echo "3. Prepare for DigitalOcean"
echo "4. Run Pre-Deployment Checks"
echo "5. Collect Static Files"
echo "6. Run Database Migrations"
echo "7. Create Superuser"
echo ""

read -p "Select an option (1-7): " option

case $option in
    1)
        echo "🔧 Setting up local development environment..."
        echo ""
        
        # Create virtual environment
        if [ ! -d "venv" ]; then
            echo "Creating virtual environment..."
            python -m venv venv
        fi
        
        # Activate virtual environment
        if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
            source venv/Scripts/activate
        else
            source venv/bin/activate
        fi
        
        # Install requirements
        echo "Installing dependencies..."
        pip install -r requirements.txt
        
        # Run migrations
        echo "Running database migrations..."
        python manage.py migrate
        
        # Collect static files
        echo "Collecting static files..."
        python manage.py collectstatic --noinput
        
        echo ""
        echo "✅ Local setup complete!"
        echo "Run: python manage.py runserver"
        ;;
        
    2)
        echo "🚀 Preparing for Heroku deployment..."
        echo ""
        
        # Check for Git
        if ! command -v git &> /dev/null; then
            echo "❌ Git not found. Please install Git first."
            exit 1
        fi
        
        # Check for Heroku CLI
        if ! command -v heroku &> /dev/null; then
            echo "❌ Heroku CLI not found."
            echo "📝 Install from: https://devcenter.heroku.com/articles/heroku-cli"
            exit 1
        fi
        
        echo "✅ Heroku CLI found"
        echo ""
        echo "📝 Next steps:"
        echo "1. Create Heroku app: heroku create <app-name>"
        echo "2. Set environment variables: heroku config:set KEY=value"
        echo "3. Deploy: git push heroku main"
        echo "4. Run migrations: heroku run python manage.py migrate"
        echo "5. Create superuser: heroku run python manage.py createsuperuser"
        echo "6. Open app: heroku open"
        ;;
        
    3)
        echo "🌊 Preparing for DigitalOcean deployment..."
        echo ""
        echo "📝 Steps:"
        echo "1. Create GitHub repository and push code"
        echo "2. Connect to DigitalOcean App Platform"
        echo "3. Configure environment variables in dashboard"
        echo "4. Set build command: pip install -r requirements.txt && python manage.py collectstatic --noinput"
        echo "5. Set run command: gunicorn crusaders_project.wsgi"
        echo "6. Deploy"
        ;;
        
    4)
        echo "🔍 Running pre-deployment checks..."
        echo ""
        
        # Check SECRET_KEY
        if [ -z "$DJANGO_SECRET_KEY" ]; then
            echo "❌ DJANGO_SECRET_KEY not set in .env"
        else
            echo "✅ DJANGO_SECRET_KEY configured"
        fi
        
        # Check DEBUG
        if [ "$DEBUG" = "True" ]; then
            echo "❌ DEBUG is True - must be False in production"
        else
            echo "✅ DEBUG is False"
        fi
        
        # Check ALLOWED_HOSTS
        if [ -z "$ALLOWED_HOSTS" ]; then
            echo "❌ ALLOWED_HOSTS not configured"
        else
            echo "✅ ALLOWED_HOSTS: $ALLOWED_HOSTS"
        fi
        
        # Check database
        if [ -z "$DB_NAME" ]; then
            echo "❌ Database not configured"
        else
            echo "✅ Database: $DB_NAME"
        fi
        
        # Check email
        if [ -z "$EMAIL_HOST_USER" ]; then
            echo "❌ Email not configured"
        else
            echo "✅ Email: $EMAIL_HOST_USER"
        fi
        
        # Check Python syntax
        echo ""
        echo "Checking Python syntax..."
        python -m py_compile manage.py
        python -m py_compile crusaders_project/settings.py
        python -m py_compile crusaders_project/wsgi.py
        echo "✅ Python syntax OK"
        
        echo ""
        echo "✅ Pre-deployment checks complete!"
        ;;
        
    5)
        echo "📦 Collecting static files..."
        python manage.py collectstatic --noinput --clear
        echo "✅ Static files collected to staticfiles/"
        ;;
        
    6)
        echo "🗄️  Running database migrations..."
        python manage.py migrate
        echo "✅ Migrations complete!"
        ;;
        
    7)
        echo "👤 Creating superuser..."
        python manage.py createsuperuser
        echo "✅ Superuser created!"
        ;;
        
    *)
        echo "❌ Invalid option"
        exit 1
        ;;
esac

echo ""
echo "Done! 🎉"
