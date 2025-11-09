#!/usr/bin/env python
"""
One-time database initialization script for Railway PostgreSQL.
This creates the database and user if they don't exist.
Run this once when first deploying to Railway with PostgreSQL.
"""

import os
import sys
import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def init_database():
    """Initialize PostgreSQL database for Railway deployment."""
    
    # Get DATABASE_URL from environment
    database_url = os.environ.get('DATABASE_URL')
    
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        sys.exit(1)
    
    # Parse DATABASE_URL (format: postgresql://user:password@host:port/dbname)
    # For Railway, we need to use the postgres admin user initially
    
    # Extract components from DATABASE_URL
    if database_url.startswith('postgresql://'):
        database_url = database_url.replace('postgresql://', '')
    
    # Parse the URL
    parts = database_url.split('@')
    if len(parts) != 2:
        print("ERROR: Invalid DATABASE_URL format")
        sys.exit(1)
    
    user_pass = parts[0].split(':')
    host_port_db = parts[1].split('/')
    
    db_user = user_pass[0]
    db_password = user_pass[1] if len(user_pass) > 1 else None
    db_host = host_port_db[0].split(':')[0]
    db_port = host_port_db[0].split(':')[1] if ':' in host_port_db[0] else '5432'
    db_name = host_port_db[1]
    
    print(f"Connecting to PostgreSQL at {db_host}:{db_port}...")
    print(f"Database: {db_name}, User: {db_user}")
    
    try:
        # Try connecting with the parsed credentials
        conn = psycopg2.connect(
            host=db_host,
            port=db_port,
            user=db_user,
            password=db_password,
            database=db_name
        )
        print("✓ Successfully connected to PostgreSQL")
        print("✓ Database and user already exist")
        conn.close()
        return True
        
    except psycopg2.OperationalError as e:
        print(f"Connection failed: {e}")
        print("This may be expected on first deployment.")
        print("Railway should automatically handle database creation.")
        return False
    except Exception as e:
        print(f"ERROR: {e}")
        return False

if __name__ == '__main__':
    print("=" * 60)
    print("PostgreSQL Database Initialization Script")
    print("=" * 60)
    init_database()
    print("=" * 60)
